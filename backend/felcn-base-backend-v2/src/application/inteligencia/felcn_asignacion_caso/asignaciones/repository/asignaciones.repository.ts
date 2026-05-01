import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_ASIG_CASOS, DB_SIII } from '@/core/config/database/database.module'
import { CreateAsignacionDto } from '../dto/create-asignacione.dto'
import { AsignacionASIG } from '../entities/asignacionAsig.entity'
import { Asignacion } from '@/application/inteligencia/felcn_siii/operaciones/asignacion/entities/asignacione.entity'

@Injectable()
export class AsignacionesRepository {
  constructor(
    @InjectRepository(Asignacion, DB_SIII)
    private readonly asignacionRepository: Repository<Asignacion>,

    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionAsigRepository: Repository<AsignacionASIG>
  ) {}

  async crearAsignacionDual(dto: CreateAsignacionDto, nroOperativo: string) {
    // SIII
    const grupoData = await this.asignacionRepository.manager
      .createQueryBuilder()
      .select([
        'd.id_distrital as "idDistrital"',
        'u.id_unidad as "idUnidad"',
        'u.abreviatura as "abreviaturaUnidad"',
      ])
      .from('grupo', 'g')
      .leftJoin('distrital', 'd', 'g.id_distrital = d.id_distrital')
      .leftJoin('unidad', 'u', 'd.id_unidad = u.id_unidad')
      .where('g.id_grupo = :idGrupo', { idGrupo: dto.idGrupo })
      .getRawOne()

    if (!grupoData) {
      throw new Error('Grupo sin distrital/unidad')
    }

    const asignacion = this.asignacionRepository.create({
      idDepartamento: dto.idDepartamento,
      grupo: dto.idGrupo,
      distrital: grupoData.idDistrital,
      unidad: grupoData.abreviaturaUnidad,
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
      usuario: dto.numeroPaseSolicitud,
    })

    const saved = await this.asignacionRepository.save(asignacion)

    const asignacionS2I = this.asignacionAsigRepository.create({
      idDepartamento: dto.idDepartamento,
      idUnidad: grupoData.abreviaturaUnidad,
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
        'd.id_departamento as "abreviaturaDepartamento"',
        'd.descripcion as "departamento"',
        'u.descripcion as "unidad"',
        'a.asignacion_caso as "asignacionCaso"',
        'a.fiscal_asignado as "fiscalAsignado"',
      ])
      .getRawMany()

    if (!asignaciones.length) return [[], 0]
    const numeros = asignaciones.map((a) => a.numeroOperativo)
    const operativos = await this.asignacionRepository.query(
      `
    SELECT 
      a.numero_operativo,
      o.id_operativo,
      a.id_caso
    FROM operativo o
    INNER JOIN asignacion a ON o.id_caso = a.id_caso
    WHERE a.numero_operativo = ANY($1)
    `,
      [numeros]
    )
    const mapOperativos = new Map<
      string,
      { idOperativo: number; idCaso: number }
    >()

    operativos.forEach((o: any) => {
      mapOperativos.set(o.numero_operativo, {
        idOperativo: o.id_operativo,
        idCaso: o.id_caso,
      })
    })

    const resultado = asignaciones
      .map((a) => {
        const idOperativo = mapOperativos.get(a.numeroOperativo)
        const existe = !!idOperativo

        return {
          ...a,
          idOperativo: idOperativo?.idOperativo || null,
          idCaso: idOperativo?.idCaso || null,
          existe,
        }
      })
      .filter((a) => (registrados ? a.existe : !a.existe))

    const total = resultado.length
    const data = resultado.slice(saltar, saltar + limite)

    return [data, total]
  }

  async obtenerMaxCorrelativo(
    dpto: string,
    letra: string,
    year: string
  ): Promise<number> {
    const result = await this.asignacionAsigRepository.query(
      `
    SELECT MAX(
      CAST(
        SPLIT_PART(SPLIT_PART(numero_caso, '-', 3), '/', 1) AS INTEGER
      )
    ) as max
    FROM asignacion
    WHERE id_departamento = $1
      AND codigo_letra = $2
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
        codigoLetra: letra,
      }
    )
  }
}
