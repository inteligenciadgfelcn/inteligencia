import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Asignacion } from '../entities/asignacione.entity'
import { DB_ASIG_CASOS, DB_SIII } from '@/core/config/database/database.module'
import { AsignacionASIG } from '../../../../felcn_asignacion_caso/asignacion/entities/asignacionAsig.entity'
import { Departamento } from '../../../parametricas/departamento/entities/departamento.entity'
import { Grupo } from '../../../parametricas/grupo/entities/grupo.entity'
import { CreateAsignacionDto } from '../dto/create-asignacione.dto'

@Injectable()
export class AsignacionesRepository {
  constructor(
    @InjectRepository(Asignacion, DB_SIII)
    private readonly asignacionRepository: Repository<Asignacion>,

    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionAsigRepository: Repository<AsignacionASIG>
  ) {}

  async crearAsignacionDual(
    dto: CreateAsignacionDto,
    departamento: Departamento,
    grupo: Grupo,
    nroOperativo: string
  ) {
    // SIII
    const asignacion = this.asignacionRepository.create({
      departamento,
      grupo,
      distrital: grupo.distrital,
      unidad: grupo.distrital.unidad,
      nroOperativo,
      codigoServicio: dto.codigoServicio,
      nombreCaso: dto.nombreCaso,
      fechaSolicitud: dto.fechaSolicitud,
      nombreSolicitud: dto.nombreSolicitud,
      telefonoSolicitud: dto.telefonoSolicitud,
      asignado: dto.asignado,
      telefonoAsignado: dto.telefonoAsignado,
      fiscalAsignado: dto.fiscalAsignado,
      telefonoFiscal: dto.telefonoFiscal,
      usuario: dto.usuario,
    })

    const saved = await this.asignacionRepository.save(asignacion)

    console.log(saved);

    // S2I
    const asignacionS2I = this.asignacionAsigRepository.create({
      idDepartamento: departamento.idDepartamento,
      idUnidad: grupo.distrital.unidad.idUnidad,
      nroOperativo,
      codigoServicio: dto.codigoServicio,
      nombreCaso: dto.nombreCaso,
      nombreSolicitud: dto.nombreSolicitud,
      fechaOperativo: dto.fechaSolicitud,
      fiscalAsignado: dto.fiscalAsignado,
      usuario: dto.usuario,
      idCasoSiii: saved.idAsignacion,
    })

    await this.asignacionAsigRepository.save(asignacionS2I)

    return saved
  }

  async findOperativos(
    codigo: string,
    registrados: boolean,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar } = pagination

    // obtener asignaciones desde felcn_asignacion
    const asignaciones = await this.asignacionAsigRepository
      .createQueryBuilder('a')
      .leftJoin('departamento', 'd', 'a.id_departamento = d.id_departamento')
      .leftJoin('unidad', 'u', 'a.id_unidad = u.id_unidad')
      .where('a.codigo_servicio = :codigo', { codigo })
      .select([
        'a.id_asignacion',
        'a.codigo_servicio',
        'a.numero_operativo ',
        'a.numero_caso ',
        'a.nombre_caso',
        'a.fecha_operativo',
        'd.descripcion as departamento ',
        'u.descripcion as unidad',
        'a.asignacion_caso ',
        'a.fiscal_asignado ',
      ])
      .getRawMany()

    if (!asignaciones.length) {
      return [[], 0]
    }

    // buscar en felcn_siii.asignacion para obtener id_caso
    const numeros = asignaciones.map((a) => a.numeroOperativo)

    const casosSIII = await this.asignacionRepository
      .createQueryBuilder('a2')
      .select([
        'a2.numero_operativo as numeroOperativo',
        'a2.id_caso as idCaso',
      ])
      .where('a2.numero_operativo IN (:...numeros)', { numeros })
      .getRawMany()

    const mapaCasos = new Map<string, number>()

    casosSIII.forEach((c) => {
      mapaCasos.set(c.numeroOperativo, c.idCaso)
    })

    const idsCaso = casosSIII.map((c) => c.idCaso)

    // buscar operativos registrados
    let setOperativos = new Set<number>()

    if (idsCaso.length) {
      const operativos = await this.asignacionRepository.query(
        `
      SELECT id_caso
      FROM operativo
      WHERE id_caso = ANY($1)
    `,
        [idsCaso]
      )

      setOperativos = new Set(operativos.map((o) => Number(o.id_caso)))
    }

    // aplicar lógica registrados / no registrados
    const resultado = asignaciones.filter((a) => {
      const idCaso = mapaCasos.get(a.numeroOperativo)

      // si no existe en SIII → no registrado
      if (!idCaso) {
        return !registrados
      }

      const existeOperativo = setOperativos.has(idCaso)

      return registrados ? existeOperativo : !existeOperativo
    })

    // paginación
    const total = resultado.length
    const data = resultado.slice(saltar, saltar + limite)

    return [data, total]
  }
}
