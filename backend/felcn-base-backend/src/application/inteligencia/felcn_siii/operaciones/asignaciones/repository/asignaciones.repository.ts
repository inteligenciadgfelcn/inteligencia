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

    const asignaciones = await this.asignacionAsigRepository
      .createQueryBuilder('a')
      .leftJoin('departamento', 'd', 'a.id_departamento = d.id_departamento')
      .leftJoin('unidad', 'u', 'a.id_unidad = u.id_unidad')
      .where('a.codigo_servicio = :codigo', { codigo })
      .select([
        'a.id_asignacion as "idAsignacion"',
        'a.codigo_servicio as "codigoServicio"',
        'a.numero_operativo as "numeroOperativo"',
        'a.numero_caso as "numeroCaso"',
        'a.nombre_caso as "nombreCaso"',
        'a.fecha_operativo as "fechaOperativo"',
        'd.abreviatura as "abreviaturaDepartamento"',
        'd.descripcion as "departamento"',
        'u.descripcion as "unidad"',
        'a.asignacion_caso as "asignacionCaso"',
        'a.fiscal_asignado as "fiscalAsignado"',
      ])
      .getRawMany()

    if (!asignaciones.length) return [[], 0]

    const numeros = asignaciones.map((a) => a.numeroOperativo)

    let setOperativos = new Set<string>()

    if (numeros.length) {
      const operativos = await this.asignacionRepository.query(
        `
      SELECT numero_operativo
      FROM operativo
      WHERE numero_operativo = ANY($1)
      `,
        [numeros]
      )

      setOperativos = new Set(operativos.map((o) => o.numero_operativo))
    }

    const resultado = asignaciones.filter((a) => {
      const existe = setOperativos.has(a.numeroOperativo)

      return registrados ? existe : !existe
    })

    const total = resultado.length
    const data = resultado.slice(saltar, saltar + limite)

    return [data, total]
  }

  async obtenerMaxCorrelativo(
    dpto: string,
    letra: string,
    year: string
  ): Promise<number> {
    const result = await this.asignacionRepository.query(
      `
    SELECT MAX(
      CAST(
        SPLIT_PART(SPLIT_PART(numero_caso, '-', 3), '/', 1) AS INTEGER
      )
    ) as max
    FROM asignacion
    WHERE abreviatura_departamento = $1
      AND letras = $2
      AND numero_caso LIKE $3
    `,
      [dpto, letra, `%/${year}`]
    )

    return result[0].max ?? 0
  }

  async actualizarNumeroCasoDual(
    nroOperativo: string,
    nroCaso: string,
    letra: string
  ) {
    // SIII
    await this.asignacionRepository.update(
      { nroOperativo: nroOperativo },
      {
        nroCaso: nroCaso.toUpperCase(),
        letra: letra,
      }
    )

    // ASIG
    await this.asignacionAsigRepository.update(
      { nroOperativo },
      {
        nroCaso: nroCaso.toUpperCase(),
        letra: letra,
      }
    )
  }
}
