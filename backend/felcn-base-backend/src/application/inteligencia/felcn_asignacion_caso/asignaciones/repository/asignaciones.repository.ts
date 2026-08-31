import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  DB_ASIG_CASOS,
  DB_AUTH,
  DB_SIII,
} from '@/core/config/database/database.module'
import { CreateAsignacionDto } from '../dto/create-asignacione.dto'
import { AsignacionASIG } from '../entities/asignacionAsig.entity'
import { Asignacion } from '@/application/inteligencia/felcn_siii/operaciones/asignacion/entities/asignacione.entity'

@Injectable()
export class AsignacionesRepository {
  constructor(
    /**
     * This connecto to felcn_siii
     */
    @InjectRepository(Asignacion, DB_SIII)
    private readonly asignacionRepository: Repository<Asignacion>,

    /**
     * This connecto to a_felcn_asignacion_caso
     */
    @InjectRepository(AsignacionASIG, DB_ASIG_CASOS)
    private readonly asignacionAsigRepository: Repository<AsignacionASIG>,

    @InjectDataSource(DB_AUTH)
    private readonly authDataSource: DataSource,

    @InjectDataSource(DB_SIII)
    private readonly siiiDataSource: DataSource
  ) { }

  async crearAsignacionDual(dto: CreateAsignacionDto, nroOperativo: string) {
    // SIII
    const [grupoData] = await this.authDataSource.query(
      `
  SELECT
    d.id as "idDistrital",
    u.id as "idUnidad",
    u.abreviatura as "abreviaturaUnidad"
  FROM parametro.grupo g
  LEFT JOIN parametro.distrital d
    ON g.id_distrital = d.id
  LEFT JOIN parametro.unidad u
    ON d.id_unidad = u.id
  WHERE g.id = $1
  `,
      [dto.idGrupo]
    )

    console.log(grupoData);


    if (!grupoData) {
      throw new Error('Grupo sin distrital/unidad')
    }

    const [fechaPart, horaPart] = dto.fechaSolicitud.split(' ')
    const [dia, mes, anio] = fechaPart.split('-').map(Number)
    const [hora, minuto] = horaPart.split(':').map(Number)

    const fechaSolicitud = new Date(anio, mes - 1, dia, hora, minuto)
    console.log('Fecha de solicitud parseada:', fechaSolicitud.toISOString());

    const asignacion = this.asignacionRepository.create({
      idDepartamento: dto.idDepartamento,
      grupo: dto.idGrupo,
      distrital: grupoData.idDistrital,
      unidad: grupoData.abreviaturaUnidad,
      nroOperativo,
      codigoServicio: dto.codigoServicio,
      nombreCaso: dto.nombreCaso,
      fechaSolicitud: fechaSolicitud,
      nombreSolicitud: dto.nombreSolicitud,
      telefonoSolicitud: dto.telefonoSolicitud,
      asignado: dto.asignado,
      telefonoAsignado: dto.telefonoAsignado,
      fiscalAsignado: dto.fiscalAsignado,
      telefonoFiscal: dto.telefonoFiscal,
      usuario: dto.numeroPaseSolicitud,
    })
    console.log('Asignación SIII guardada con ID:', asignacion)
    const saved = await this.asignacionRepository.save(asignacion)

    const abreviaturaIcia = await this.codigoUnidad(grupoData.abreviaturaUnidad)

    const asignacionS2I = this.asignacionAsigRepository.create({
      idDepartamento: dto.idDepartamento,
      idUnidad: abreviaturaIcia as any,
      nroOperativo,
      codigoServicio: dto.codigoServicio,
      nombreCaso: dto.nombreCaso,
      nombreSolicitud: dto.nombreSolicitud,
      fechaOperativo: fechaSolicitud,
      fiscalAsignado: dto.fiscalAsignado,
      usuario: dto.usuario,
      idCasoSiii: saved.idAsignacion,
    })

    await this.asignacionAsigRepository.save(asignacionS2I)

    return saved
  }

  async codigoUnidad(codUnid: string): Promise<string> {
    const result = await this.siiiDataSource.query(
      `
      SELECT u.abreviatura_icia
      FROM unidad u
      WHERE u.abreviatura = $1
      `,
      [codUnid.trim()],
    );

    return result.length > 0 ? result[0].abreviatura_icia : '';
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
  year: string,
): Promise<number> {
  const patron = `${dpto}-${letra}-%/${year}`

  const result: Array<{ max: number | string }> =
    await this.asignacionAsigRepository.query(
      `
      SELECT COALESCE(
        MAX(
          SPLIT_PART(
            SPLIT_PART(TRIM(numero_caso), '-', 3),
            '/',
            1
          )::INTEGER
        ),
        0
      ) AS "max"
      FROM asignacion
      WHERE UPPER(TRIM(numero_caso))
        LIKE UPPER($1)
        AND SPLIT_PART(
          SPLIT_PART(TRIM(numero_caso), '-', 3),
          '/',
          1
        ) ~ '^[0-9]+$'
      `,
      [patron],
    )

  const maximo = Number(result[0]?.max ?? 0)
  return maximo + 1
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
