import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_SII, DB_SIII } from '@/core/config/database/database.module'

import { Detenido } from '../../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { FiltrosVariablesCruzadasDto } from '../dto/filtros-variables-cruzadas.dto'

@Injectable()
export class VariablesCruzadasRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly siiiDataSource: DataSource,

    @InjectDataSource(DB_SII)
    private readonly siiDataSource: DataSource
  ) {}

  async buscarPersonasSiii(
    filtros: FiltrosVariablesCruzadasDto
  ): Promise<any[]> {
    const query = this.siiiDataSource
      .createQueryBuilder()
      .from('persona_auxiliar', 'p')
      .innerJoin('operativo', 'o', 'o.id_operativo = p.id_operativo')
      .innerJoin('asignacion', 'a', 'a.id_caso = o.id_caso')
      .select([
        'a.id_caso AS id_caso',
        'a.numero_caso AS numero_caso',
        'a.nombre_caso AS nombre_caso',
        'a.ianus AS cud',

        `a.id_departamento_caso
          AS id_departamento_caso`,

        `a.id_distrital
          AS id_distrital_asignacion`,

        `a.id_grupo
          AS id_grupo_asignacion`,

        `a.abreviatura_unidad
          AS abreviatura_unidad`,

        `a.numero_operativo
          AS numero_operativo_asignacion`,

        'o.id_operativo AS id_operativo',

        /*
         * Fecha calendario del operativo en Bolivia.
         */
        `TO_CHAR(
          o.fecha_operativo
            AT TIME ZONE 'America/La_Paz',
          'YYYY-MM-DD'
        ) AS fecha_operativo`,

        'o.lugar AS lugar',

        `o.id_departamento
          AS id_departamento_operativo`,

        'o.id_provincia AS id_provincia',
        'o.id_localidad AS id_localidad',
        'o.id_unidad AS id_unidad',

        `o.id_distrital
          AS id_distrital_operativo`,

        `o.id_grupo
          AS id_grupo_operativo`,

        'o.es_positivo AS es_positivo',
        'o.es_aprehendido AS es_aprehendido',
        'o.es_arrestado AS es_arrestado',

        `p.id_persona_auxiliar
          AS id_persona_auxiliar`,

        'p.nombres AS nombres_auxiliar',

        `p.apellido_paterno
          AS apellido_paterno_auxiliar`,

        `p.apellido_materno
          AS apellido_materno_auxiliar`,

        `p.apellido_esposo
          AS apellido_esposo_auxiliar`,

        'p.id_pais AS id_pais_auxiliar',

        `p.id_tipo_documento
          AS id_tipo_documento_auxiliar`,

        `p.nro_documento
          AS documento_auxiliar`,

        /*
         * Fecha de nacimiento sin hora.
         */
        `TO_CHAR(
          p.fecha_nacimiento
            AT TIME ZONE 'America/La_Paz',
          'YYYY-MM-DD'
        ) AS fecha_nacimiento_auxiliar`,

        `p.direccion
          AS direccion_auxiliar`,

        'p.estado AS estado_persona',

        /*
         * Fecha y hora de creación del registro.
         */
        `TO_CHAR(
          p.fecha_hora_ingreso
            AT TIME ZONE 'America/La_Paz',
          'YYYY-MM-DD HH24:MI:SS'
        ) AS fecha_registro_persona`,

        `p.genero
          AS genero_auxiliar_codigo`,

        'p.enviado AS enviado',

        `CASE
          WHEN p.genero = B'1'
            THEN 'Masculino'

          WHEN p.genero = B'0'
            THEN 'Femenino'

          ELSE 'Sin registrar'
        END AS genero_auxiliar`,

        `CASE
          WHEN p.fecha_nacimiento IS NOT NULL
          THEN EXTRACT(
            YEAR FROM AGE(
              CURRENT_DATE,
              (
                p.fecha_nacimiento
                  AT TIME ZONE 'America/La_Paz'
              )::date
            )
          )::integer

          ELSE NULL
        END AS edad`,

        `CASE
          WHEN p.enviado = 1
            THEN 'Filiado'

          ELSE 'Sin filiar'
        END AS filiacion`,
      ])

    /*
     * Número de caso.
     */
    if (filtros.numeroCaso?.trim()) {
      query.andWhere('a.numero_caso ILIKE :numeroCaso', {
        numeroCaso: `%${filtros.numeroCaso.trim()}%`,
      })
    }

    /*
     * Nombre del caso.
     */
    if (filtros.nombreCaso?.trim()) {
      query.andWhere('a.nombre_caso ILIKE :nombreCaso', {
        nombreCaso: `%${filtros.nombreCaso.trim()}%`,
      })
    }

    /*
     * CUD / IANUS.
     */
    if (filtros.cud?.trim()) {
      query.andWhere('a.ianus ILIKE :cud', {
        cud: `%${filtros.cud.trim()}%`,
      })
    }

    /*
     * Rango de fecha del operativo.
     */
    if (filtros.fechaOperativoDesde) {
      query.andWhere(
        `(
          o.fecha_operativo
            AT TIME ZONE 'America/La_Paz'
        )::date >= :fechaOperativoDesde::date`,
        {
          fechaOperativoDesde: filtros.fechaOperativoDesde,
        }
      )
    }

    if (filtros.fechaOperativoHasta) {
      query.andWhere(
        `(
          o.fecha_operativo
            AT TIME ZONE 'America/La_Paz'
        )::date <= :fechaOperativoHasta::date`,
        {
          fechaOperativoHasta: filtros.fechaOperativoHasta,
        }
      )
    }

    /*
     * Rango de fecha de registro de persona auxiliar.
     */
    if (filtros.fechaRegistroDesde) {
      query.andWhere(
        `(
          p.fecha_hora_ingreso
            AT TIME ZONE 'America/La_Paz'
        )::date >= :fechaRegistroDesde::date`,
        {
          fechaRegistroDesde: filtros.fechaRegistroDesde,
        }
      )
    }

    if (filtros.fechaRegistroHasta) {
      query.andWhere(
        `(
          p.fecha_hora_ingreso
            AT TIME ZONE 'America/La_Paz'
        )::date <= :fechaRegistroHasta::date`,
        {
          fechaRegistroHasta: filtros.fechaRegistroHasta,
        }
      )
    }

    /*
     * Estado de la persona auxiliar.
     */
    if (filtros.estadoPersona?.trim()) {
      query.andWhere(
        `UPPER(TRIM(p.estado)) =
         UPPER(TRIM(:estadoPersona))`,
        {
          estadoPersona: filtros.estadoPersona.trim(),
        }
      )
    }

    /*
     * Unidad.
     */
    if (filtros.idUnidad !== undefined) {
      query.andWhere('o.id_unidad = :idUnidad', {
        idUnidad: filtros.idUnidad,
      })
    }

    /*
     * Grupo.
     */
    if (filtros.idGrupo !== undefined) {
      query.andWhere('o.id_grupo = :idGrupo', {
        idGrupo: filtros.idGrupo,
      })
    }

    /*
     * Distrito.
     */
    if (filtros.idDistrito !== undefined) {
      query.andWhere('o.id_distrital = :idDistrito', {
        idDistrito: filtros.idDistrito,
      })
    }

    /*
     * Departamento.
     */
    if (filtros.idDepartamento !== undefined) {
      query.andWhere('o.id_departamento = :idDepartamento', {
        idDepartamento: filtros.idDepartamento,
      })
    }

    /*
     * Filiación.
     */
    if (filtros.filiacion === 'FILIADO') {
      query.andWhere('p.enviado = 1')
    }

    if (filtros.filiacion === 'SIN_FILIAR') {
      query.andWhere(
        `(
          p.enviado = 0
          OR p.enviado IS NULL
        )`
      )
    }

    return query
      .orderBy('a.numero_caso', 'ASC')
      .addOrderBy('o.fecha_operativo', 'DESC')
      .addOrderBy('p.id_persona_auxiliar', 'ASC')
      .getRawMany()
  }

  async buscarDetenidosSii(numerosCaso: string[]): Promise<any[]> {
    if (!numerosCaso.length) {
      return []
    }

    return this.siiDataSource
      .getRepository(Detenido)
      .createQueryBuilder('d')
      .leftJoin('d.pais', 'pa')
      .leftJoin('d.estadoCivil', 'ec')
      .select([
        'd.id_detenido AS id_detenido',
        'd.numero_caso AS numero_caso',
        'd.nombres AS nombres_sii',

        `d.apellido_paterno
          AS apellido_paterno_sii`,

        `d.apellido_materno
          AS apellido_materno_sii`,

        `d.apellido_esposo
          AS apellido_esposo_sii`,

        'd.id_pais AS id_pais_sii',
        'pa.descripcion AS pais_sii',

        `d.genero
          AS genero_sii_codigo`,

        `TO_CHAR(
          d.fecha_nacimiento
            AT TIME ZONE 'America/La_Paz',
          'YYYY-MM-DD'
        ) AS fecha_nacimiento_sii`,

        `d.id_estado_civil
          AS id_estado_civil`,

        'ec.descripcion AS estado_civil',

        `d.direccion
          AS direccion_sii`,

        'd.esta_vivo AS esta_vivo',

        `d.tiene_tarjeta
          AS tiene_tarjeta`,
        `TO_CHAR(
          d.fecha_hora_ingreso
            AT TIME ZONE 'America/La_Paz',
          'YYYY-MM-DD HH24:MI:SS'
        ) AS fecha_ingreso_sii`,
      ])
      .addSelect(
        `COALESCE(
          (
            SELECT ARRAY_AGG(
              DISTINCT documento.numero_documento
            )
            FROM public.documento_detenido documento
            WHERE documento.id_detenido =
                  d.id_detenido
          ),
          ARRAY[]::varchar[]
        )`,
        'documentos_sii'
      )
      .where(
        `UPPER(TRIM(d.numero_caso))
         IN (:...numerosCaso)`,
        {
          numerosCaso: numerosCaso.map((numeroCaso) =>
            numeroCaso.trim().toUpperCase()
          ),
        }
      )
      .orderBy('d.numero_caso', 'ASC')
      .addOrderBy('d.id_detenido', 'ASC')
      .getRawMany()
  }
}
