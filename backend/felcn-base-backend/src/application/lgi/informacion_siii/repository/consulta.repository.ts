import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_SIII } from '@/core/config/database/database.module'
import {
  ConsultaSiiiQueryDto,
  RespuestaAvanzadaCompleta,
  ResultadoConsultaAvanzada,
} from '../dto/consulta_siii.dto'

@Injectable()
export class ConsultaSiiiRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) {}

  private readonly SQL_AVANZADO = `
    SELECT
      o.id_operativo::text AS "idOperativo",
      TO_CHAR(o.fecha_operativo, 'DD/MM/YYYY HH24:MI')
        AS "fechaOperativo",
      a.numero_caso AS "numeroCaso",
      a.numero_operativo AS "numeroOperativo",
      o.numero_informe AS "numeroInforme",

      COALESCE(TRIM(uni.abreviatura), '')
        || ' - ' || COALESCE(TRIM(dis.descripcion), '')
        AS "ubicacionInstitucional",

      dep.descripcion
        || ' - ' || prov.descripcion
        || ' - ' || UPPER(loc.descripcion)
        || ' - ' || UPPER(TRIM(o.lugar))
        AS "ubicacionGeografica",

      a.nombre_caso AS "nombreCaso",
      a.ianus AS "ianus",
      TRIM(a.fiscal_solicitud) AS "fiscalSolicitud",
      TRIM(a.asignado_caso) AS "asignado",
      TRIM(a.fiscal_asignado_caso) AS "asignadoFiscal",
      top.descripcion AS "tipoOperativo",
      tr.descripcion AS "tipoRelevancia",
      COALESCE(tr.color, '') AS "colorRelevancia",
      cat.descripcion AS "categoriaOperativo",
      po.nombre AS "planOperacion",
      tden.descripcion AS "tipoDenuncia",
      tpen.descripcion AS "tipoPenal",
      TRIM(o.organizacion) AS "organizacion",
      TRIM(o.mando) AS "alMandoDe",
      TRIM(o.clan_familiar) AS "clanFamiliar",
      o.es_positivo AS "esPositivo",
      o.es_aprehendido AS "esAprehendido",
      o.es_arrestado AS "esArrestado",
      o.es_icia AS "esIcia",
      o.es_parte_diario AS "esParteDiario",
      o.es_revisado AS "esRevisado",
      o.coord_x AS "coordX",
      o.coord_y AS "coordY",

      COALESCE((
        SELECT STRING_AGG(
          CONCAT_WS(
            ' ',
            NULLIF(TRIM(per.nombres), ''),
            NULLIF(TRIM(per.apellido_paterno), ''),
            NULLIF(TRIM(per.apellido_materno), ''),
            NULLIF(TRIM(per.apellido_esposo), '')
          )
            || E'\\n   Doc.: '
            || COALESCE(TRIM(per.nro_documento), '')
            || E'\\n   Nac.: '
            || COALESCE(pa_per.descripcion, '')
            || E'\\n   Estado: '
            || COALESCE(per.estado, ''),
          ' | '
          ORDER BY CASE UPPER(TRIM(per.estado))
            WHEN 'PRINCIPAL IMPLICADO' THEN 1
            WHEN 'APREHENDIDO' THEN 2
            WHEN 'ARRESTADO' THEN 3
            ELSE 4
          END
        )
        FROM public.persona_auxiliar per
        JOIN parametricas.pais pa_per
          ON per.id_pais = pa_per.id_pais
        WHERE per.id_operativo = o.id_operativo
      ), '') AS "personasImplicadas",

      COALESCE((
        SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'idItemBienSecuestrado',
              ibs.id_item_bien_secuestrado::text,
            'tipoBien',
              ct.descripcion,
            'cantidad',
              ibs.cantidad_bien,
            'costoAproximado',
              ibs.costo_aproximado,
            'costoCuantificado',
              ibs.costo_cuantificado,
            'enInvestigacion',
              ibs.en_investigacion,

            'caracteristicas',
              COALESCE((
                SELECT JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                    'idCatalogoCaracteristica',
                      ibc.id_catalogo_caracteristica,
                    'descripcion',
                      ibc.descripcion
                  )
                  ORDER BY ibc.id_item_bien_caracteristica
                )
                FROM public.item_bien_caracteristica ibc
                WHERE ibc.id_item_bien_secuestrado =
                  ibs.id_item_bien_secuestrado
              ), '[]'::jsonb),

            'esSecuestrado',
              EXISTS (
                SELECT 1
                FROM public.bien_secuestrado bs
                WHERE bs.id_item_bien_secuestrado =
                  ibs.id_item_bien_secuestrado
              ),

            'esIncautado',
              EXISTS (
                SELECT 1
                FROM public.bien_incautado bi
                WHERE bi.id_item_bien_secuestrado =
                  ibs.id_item_bien_secuestrado
              ),

            'esConfiscado',
              EXISTS (
                SELECT 1
                FROM public.bien_confiscado bc
                WHERE bc.id_item_bien_secuestrado =
                  ibs.id_item_bien_secuestrado
              )
          )
          ORDER BY ibs.id_item_bien_secuestrado
        )
        FROM public.item_bien_secuestrado ibs
        JOIN public.catalogo_tipo ct
          ON ct.id_catalogo_tipo = ibs.id_catalogo_tipo
        WHERE ibs.id_operativo = o.id_operativo
      ), '[]'::jsonb) AS "detalleBienes",

      COALESCE((
  SELECT SUM(COALESCE(ibs.costo_aproximado, 0))
  FROM public.item_bien_secuestrado ibs
  WHERE ibs.id_operativo = o.id_operativo
), 0) AS "costoTotalAproximadoBienes",

COALESCE((
  SELECT SUM(COALESCE(ibs.costo_cuantificado, 0))
  FROM public.item_bien_secuestrado ibs
  WHERE ibs.id_operativo = o.id_operativo
), 0) AS "costoTotalCuantificadoBienes"

    FROM public.asignacion a
    JOIN public.operativo o
      ON a.id_caso = o.id_caso
    JOIN parametricas.departamento dep
      ON o.id_departamento = dep.id_departamento
    JOIN parametricas.provincia prov
      ON o.id_provincia = prov.id_provincia
    JOIN parametricas.localidad loc
      ON o.id_localidad = loc.id_localidad
    JOIN parametricas.tipo_operacion top
      ON o.id_tipo_operacion = top.id_tipo_operacion
    JOIN parametricas.tipo_relevancia tr
      ON o.id_tipo_relevancia = tr.id_tipo_relevancia
    JOIN parametricas.plan_operaciones po
      ON o.id_plan_operacion = po.id_plan_operacion
    JOIN parametricas.categoria_operativo cat
      ON o.id_categoria_operativo = cat.id_categoria_operativo
    LEFT JOIN auth_fdw.unidad uni
      ON o.id_unidad = uni.id
    LEFT JOIN auth_fdw.distrital dis
      ON o.id_distrital = dis.id
    LEFT JOIN parametricas.tipo_denuncia tden
      ON o.id_tipo_denuncia = tden.id_tipo_denuncia
    LEFT JOIN parametricas.tipo_penal tpen
      ON o.id_tipo_penal = tpen.id_tipo_penal

    WHERE
      ($1::text IS NULL OR a.codigo_servicio ILIKE '%' || $1 || '%')
      AND ($2::date IS NULL OR o.fecha_operativo >= $2::date)
      AND (
        $3::date IS NULL
        OR o.fecha_operativo < ($3::date + INTERVAL '1 day')
      )
      AND ($4::text IS NULL OR a.numero_caso ILIKE '%' || $4 || '%')
      AND ($5::text IS NULL OR a.nombre_caso ILIKE '%' || $5 || '%')
      AND ($6::text IS NULL OR EXISTS (
        SELECT 1
        FROM public.persona_auxiliar per
        WHERE per.id_operativo = o.id_operativo
          AND per.nombres ILIKE '%' || $6 || '%'
      ))
      AND ($7::text IS NULL OR EXISTS (
        SELECT 1
        FROM public.persona_auxiliar per
        WHERE per.id_operativo = o.id_operativo
          AND per.apellido_paterno ILIKE '%' || $7 || '%'
      ))
      AND ($8::text IS NULL OR EXISTS (
        SELECT 1
        FROM public.persona_auxiliar per
        WHERE per.id_operativo = o.id_operativo
          AND per.apellido_materno ILIKE '%' || $8 || '%'
      ))
      AND ($9::text IS NULL OR EXISTS (
        SELECT 1
        FROM public.persona_auxiliar per
        WHERE per.id_operativo = o.id_operativo
          AND per.nro_documento ILIKE '%' || $9 || '%'
      ))

    ORDER BY o.fecha_operativo DESC
  `

  async buscarAvanzado(
    filtro: ConsultaSiiiQueryDto
  ): Promise<RespuestaAvanzadaCompleta> {
    const s = (valor?: string): string | null => valor?.trim() || null

    const params = [
      s(filtro.codigoServicio), // $1
      s(filtro.fechaInicio), // $2
      s(filtro.fechaFin), // $3
      s(filtro.numeroCaso), // $4
      s(filtro.nombreCaso), // $5
      s(filtro.nombresPersona), // $6
      s(filtro.apellidoPaterno), // $7
      s(filtro.apellidoMaterno), // $8
      s(filtro.nroDocumento), // $9
    ]

    const filas = await this.dataSource.query<ResultadoConsultaAvanzada[]>(
      this.SQL_AVANZADO,
      params
    )

    return { filas }
  }
}
