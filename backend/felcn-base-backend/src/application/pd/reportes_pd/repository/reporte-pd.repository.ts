import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
export interface DatosCasoPd {
  casosId: string
  nombreCaso: string
  numeroCaso: string
  numeroCasoGiaef: string | null
  numeroCasoFiscalia: string | null
  numeroCasoPerdidaDominio: string | null
  perdidaDominio: boolean | null
  fechaInicio: Date | null
  etapaInvestigacion: string | null
  estadoProcesal: string | null
  fiscalAsignado: string
  controlJurisdiccional: string
  conformeA: string
  formalizacionAccion: string | null
  diasOtorgados: number | null
  codigoServicio: string | null
  unidadAbreviada: string
  distrital: string | null
  grupo: string | null
}
export interface InvestigadorPd {
  invId: string
  numeroPase: string
  memorando: string
  fechaAsignacion: Date
  actual: boolean
  estadoInvestigador: string
  fechaSeparacion: Date | null
  informacion: string
}
export interface PersonaPd {
  deId: string
  nombreCompleto: string
  numeroDocumento: string
  tipoDocumento: string | null
  nacionalidad: string | null
  relacion: string | null
  observaciones: string | null
  sexo: string | null
}
export interface SeleccionPd { id: string; descripcion: string | null }
export interface ReferenciaPrecedentePd { preseId: string; numeroCaso: string }




export interface ImplicadoEmpresaPd {
  impId: string
  nombreCompleto: string
  tipoImplicado: string | null
  tipoDocumento: string | null
  numeroDocumento: string
}
export interface SituacionEmpresaPd {
  id: string
  descripcion: string | null
  fecha: string | null
  fechaRegistro: string | null
  usuario: string | null
}
export interface EmpresaPd {
  empId: string
  opId: string
  numeroActuacion: string
  fechaActuacion: Date
  nombre: string
  nit: string
  matricula: string
  representante: string
  capitalSocial: string | null
  direccion: string | null
  latitud: string | null
  longitud: string | null
  vinculo: string | null
  observaciones: string
  pericia: boolean
  resultadoPericia: string | null
  documento: string | null
  fechaRegistro: Date
  imagen: Buffer | null
  implicados: ImplicadoEmpresaPd[]
  historialJuridico: SituacionEmpresaPd[]
}


export interface ActuacionPd {
  opId: string; numeroActuacion: string; fechaInforme: Date;
  tipoInforme: string | null; otroInforme: string | null;
  lugar: string | null; sintesis: string; documento: string | null
}
export interface VinculoReportePd {
  id: string; deId: string | null; nombreCompleto: string | null;
  numeroDocumento: string | null; tipoDocumento: string | null;
  vinculo: string | null; tipoVinculo: string | null
}
export interface MedidaBienPd {
  id: string; tipo: string; fecha: string | null; fechaRegistro: string | null;
  detalle: string | null; autoridad: string | null; investigador: string | null;
  documento: string | null; usuario: string | null
}
export interface CustodiaBienPd {
  id: string; calidad: string | null; fecha: string | null;
  fiscal: string; responsable: string; institucion: string | null;
  ubicacion: string | null; tipoDocumento: string | null;
  numeroDocumento: string | null
}
export interface BienReportePd {
  itemBienSecId: string; opId: string; numeroActuacion: string;
  tipoBien: string | null; claseBien: string | null; cantidad: number;
  valorAproximado: number; valorCuantificado: number | null;
  enInvestigacion: boolean; lugarSecuestro: string | null;
  latitud: number | null; longitud: number | null;
  pericia: boolean; resultadoPericia: string | null; fechaRegistro: Date;
  caracteristicas: Array<{ etiqueta: string | null; valor: string }>;
  vinculados: VinculoReportePd[];
  medidas: MedidaBienPd[];
  custodias: CustodiaBienPd[];
  fotografias: Array<{ id: string; descripcion: string; hex: string }>;
  informacionJuridica: Array<{ id: string; descripcion: string; fecha: string }>;
}

@Injectable()
export class ReportePdRepository {
  constructor(
    // Cambiar a @InjectDataSource(TU_CONEXION_PD) si tu conexión es nombrada.
    @InjectDataSource(DB_LGI) private readonly dataSource: DataSource,
  ) {}

  async obtenerCaso(casosId: string): Promise<DatosCasoPd | null> {
    const filas = await this.dataSource.query<DatosCasoPd[]>(`
      SELECT
        a.casos_id::text AS "casosId",
        a.nombrecaso AS "nombreCaso",
        a.nrocaso AS "numeroCaso",
        a.nrocasogiaef AS "numeroCasoGiaef",
        a.nrocasofis AS "numeroCasoFiscalia",
        a.nrocasoperdom AS "numeroCasoPerdidaDominio",
        a.perddom AS "perdidaDominio",
        a.fechainicio AS "fechaInicio",
        ei.descripcion AS "etapaInvestigacion",
        TRIM(e.descripcion) AS "estadoProcesal",
        a.remitefiscal AS "fiscalAsignado",
        a.control_juridiccional AS "controlJurisdiccional",
        a.conformea AS "conformeA",
        a.formalizacion_accion AS "formalizacionAccion",
        a.dias_otorgados AS "diasOtorgados",
        a.codigo_servicio AS "codigoServicio",
        a.uni_abrev AS "unidadAbreviada",
        d.dis_descripcion AS "distrital",
        TRIM(g.descripcion) AS "grupo"
      FROM public.asignacion a
      LEFT JOIN parametricas.etapainvest ei ON ei.eta_inv = a.eta_inv
      LEFT JOIN parametricas.estado e ON e.est_id = a.id_estado
      LEFT JOIN parametricas.distritales d ON d.dis_id = a.dis_id
      LEFT JOIN parametricas.grupos g ON g.grp_id = a.id_grupo
      WHERE a.casos_id = $1::bigint AND a.estado = 'ACTIVO'
    `, [casosId])
    return filas[0] ?? null
  }

  obtenerInvestigadores(casosId: string): Promise<InvestigadorPd[]> {
    return this.dataSource.query<InvestigadorPd[]>(`
        SELECT inv_id::text AS "invId",
          TRIM(usuario_asignado) AS "numeroPase", memo AS "memorando",
          fechaasignacion AS "fechaAsignacion", actual,
          estado_investigador::text AS "estadoInvestigador",
          fecha_separacion AS "fechaSeparacion", updinf AS "informacion"
        FROM public.investigador
        WHERE casos_id = $1::bigint
        ORDER BY actual DESC, fechaasignacion DESC, inv_id DESC
      `, [casosId])
  }

  obtenerPersonasInvestigadas(casosId: string): Promise<PersonaPd[]> {
    return this.dataSource.query<PersonaPd[]>(`
        SELECT p.de_id::text AS "deId",
          CONCAT_WS(' ', NULLIF(TRIM(p.de_nombres), ''),
            NULLIF(TRIM(p.de_paterno), ''), NULLIF(TRIM(p.de_materno), ''),
            NULLIF(TRIM(p.de_esposo), '')) AS "nombreCompleto",
          p.nro_docum AS "numeroDocumento", td.descripcion AS "tipoDocumento",
          pa.descripcion AS "nacionalidad", p.relacion, p.observaciones, p.sexo
        FROM public.detenidosaux p
        LEFT JOIN parametricas.tipodoc td ON td.td_id = p.td_id
        LEFT JOIN parametricas.pais pa ON pa.pa_id = p.pa_id
        WHERE p.caso_id = $1::bigint AND p.estado = true
        ORDER BY p.de_id
      `, [casosId])
  }

  obtenerBienesSujetosPd(casosId: string): Promise<SeleccionPd[]> {
    return this.dataSource.query<SeleccionPd[]>(`
        SELECT b.id_bien_sujeto_pd::text AS id, b.descripcion
        FROM public.caso_bien_sujeto_pd cb
        JOIN parametricas.bien_sujeto_pd b
          ON b.id_bien_sujeto_pd = cb.id_bien_sujeto_pd
        WHERE cb.casos_id = $1::bigint ORDER BY b.id_bien_sujeto_pd
      `, [casosId])
  }

  obtenerSentencias(casosId: string): Promise<SeleccionPd[]> {
    return this.dataSource.query<SeleccionPd[]>(`
        SELECT s.id_sentencia::text AS id, s.descripcion
        FROM public.caso_sentencia cs
        JOIN parametricas.sentencia s ON s.id_sentencia = cs.id_sentencia
        WHERE cs.casos_id = $1::bigint ORDER BY s.id_sentencia
      `, [casosId])
  }

  obtenerReferenciasPrecedentes(casosId: string): Promise<ReferenciaPrecedentePd[]> {
    return this.dataSource.query<ReferenciaPrecedentePd[]>(`
        SELECT prese_id::text AS "preseId", TRIM(nrocasopre) AS "numeroCaso"
        FROM public.presedencia
        WHERE casos_id = $1::bigint AND estado = 'ACTIVO'
        ORDER BY prese_id
      `, [casosId])
  }

  obtenerEmpresas(casosId: string): Promise<EmpresaPd[]> {
    return this.dataSource.query<EmpresaPd[]>(`
      SELECT
        e.emp_id::text AS "empId", e.op_id::text AS "opId",
        o.op_nrooper AS "numeroActuacion", o.op_fechainf AS "fechaActuacion",
        e.nombre, e.nit, e.matricula, e.representante,
        e.capital_social AS "capitalSocial", e.direccion,
        e.latitud, e.longitud, v.descripcion AS "vinculo",
        e.obs AS "observaciones", e.pericia, e.resultado AS "resultadoPericia",
        e.documento, e.fechahoraing AS "fechaRegistro", e.imagen,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'impId', i.imp_id::text,
            'nombreCompleto', CONCAT_WS(' ', NULLIF(TRIM(i.de_nombres), ''),
              NULLIF(TRIM(i.de_paterno), ''), NULLIF(TRIM(i.de_materno), ''),
              NULLIF(TRIM(i.de_esposo), '')),
            'tipoImplicado', ti.descripcion,
            'tipoDocumento', td.descripcion,
            'numeroDocumento', i.nrodoc
          ) ORDER BY i.imp_id)
          FROM public.implicados i
          LEFT JOIN parametricas.tipoimplicado ti
            ON ti.id_tipo_implicado = i.id_tipo_implicado
          LEFT JOIN parametricas.tipodoc td ON td.td_id = i.tipo_documento
          WHERE i.id_empresa = e.emp_id AND i.op_id = e.op_id
            AND i.estado = 'ACTIVO'
        ), '[]'::jsonb) AS "implicados",
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', sj.id_situacion_juridica_empresa::text,
            'descripcion', ts.descripcion,
            'fecha', sj.fecha::text,
            'fechaRegistro', sj.fechahoraing,
            'usuario', sj.usuario
          ) ORDER BY sj.fecha DESC NULLS LAST,
            sj.fechahoraing DESC NULLS LAST,
            sj.id_situacion_juridica_empresa DESC)
          FROM public.situacion_juridica_empresa sj
          LEFT JOIN parametricas.tipo_situacion_juridica ts
            ON ts.id_tipo_situacion_juridica = sj.id_tipo_situacion_juridica
          WHERE sj.id_empresa = e.emp_id
        ), '[]'::jsonb) AS "historialJuridico"
      FROM public.empresas e
      JOIN public.operativo o ON o.op_id = e.op_id
      LEFT JOIN parametricas.vinculo v ON v.id_vinculo = e.id_vinculo
      WHERE o.casos_id = $1::bigint AND o.estado = 'ACTIVO'
      ORDER BY o.op_fechainf, o.op_id, e.emp_id
    `, [casosId])
  }

  obtenerActuaciones(casosId: string): Promise<ActuacionPd[]> {
    return this.dataSource.query<ActuacionPd[]>(`
      SELECT o.op_id::text AS "opId", o.op_nrooper AS "numeroActuacion",
        o.op_fechainf AS "fechaInforme", ti.descripcion AS "tipoInforme",
        o.otro_informe AS "otroInforme", o.op_lugar AS lugar,
        o.op_descripcion AS sintesis, o.ruta_archivo AS documento
      FROM public.operativo o
      LEFT JOIN parametricas.tipo_informe ti ON ti.id = o.id_tipo_informe
      WHERE o.casos_id = $1::bigint AND o.estado = 'ACTIVO'
      ORDER BY o.op_fechainf, o.op_id
    `, [casosId])
  }

  obtenerBienesDetallados(casosId: string): Promise<BienReportePd[]> {
    return this.dataSource.query<BienReportePd[]>(`
      SELECT b.itembiensec_id::text AS "itemBienSecId", b.op_id::text AS "opId",
        o.op_nrooper AS "numeroActuacion", ct.descripcion AS "tipoBien",
        cl.descripcion AS "claseBien", b.cantidadbien AS cantidad,
        b.costoaprox AS "valorAproximado", b.costocuant AS "valorCuantificado",
        b.inves AS "enInvestigacion", b.lugar_secuestro AS "lugarSecuestro",
        b.latitud, b.longitud, b.pericia, b.resultado_pericia AS "resultadoPericia",
        b.fechahoraing AS "fechaRegistro",
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'etiqueta', cc.descripcion, 'valor', bc.descripcion
          ) ORDER BY bc.itembiencar_id)
          FROM public.itembiencaracteristicas bc
          LEFT JOIN parametricas.catalogocaracteristicas cc ON cc.catcarac_id = bc.catcarac_id
          WHERE bc.itembiensec_id = b.itembiensec_id AND bc.estado = 'ACTIVO'
        ), '[]'::jsonb) AS caracteristicas,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', v.id_vinculo_bien::text, 'deId', p.de_id::text,
            'nombreCompleto', NULLIF(CONCAT_WS(' ', NULLIF(TRIM(p.de_nombres), ''),
              NULLIF(TRIM(p.de_paterno), ''), NULLIF(TRIM(p.de_materno), ''),
              NULLIF(TRIM(p.de_esposo), '')), ''),
            'numeroDocumento', p.nro_docum, 'tipoDocumento', td.descripcion,
            'vinculo', pv.descripcion, 'tipoVinculo', tv.descripcion
          ) ORDER BY v.id_vinculo_bien)
          FROM public.vinculo_bien v
          LEFT JOIN public.detenidosaux p ON p.de_id = v.id_detenido_auxiliar
          LEFT JOIN parametricas.tipodoc td ON td.td_id = p.td_id
          LEFT JOIN parametricas.vinculo pv ON pv.id_vinculo = v.id_vinculo
          LEFT JOIN parametricas.tipo_vinculo tv ON tv.id_tipo_vinculo = v.id_tipo_vinculo
          WHERE v.id_item_bien_secuestrado = b.itembiensec_id AND v.estado = 'ACTIVO'
        ), '[]'::jsonb) AS vinculados,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', h.id::text, 'tipo', h.tipo, 'fecha', h.fecha,
            'fechaRegistro', h.fecha_registro, 'detalle', h.detalle,
            'autoridad', h.autoridad, 'investigador', h.investigador,
            'documento', h.documento, 'usuario', h.usuario
          ) ORDER BY h.fecha DESC NULLS LAST, h.fecha_registro DESC NULLS LAST,
            h.tipo, h.id DESC)
          FROM (
            SELECT sec.bsec_id AS id, 'Secuestrado'::text AS tipo,
              sec.fechaactsec::timestamp AS fecha, sec.fechahoraing::timestamp AS fecha_registro,
              NULL::text AS detalle, sec.fiscal::text AS autoridad,
              sec.investigador::text AS investigador, NULL::text AS documento,
              sec.usuario::text AS usuario
            FROM public.bienessecuestados sec WHERE sec.itembiensec_id = b.itembiensec_id
            UNION ALL
            SELECT inc.binc_id, 'Incautado', inc.fechares::timestamp,
              inc.fechahoraing::timestamp, NULL::text, inc.autoridad::text,
              NULL::text, TRIM(inc.nroresol)::text, inc.usuario::text
            FROM public.bienesincautados inc WHERE inc.itembiensec_id = b.itembiensec_id
            UNION ALL
            SELECT con.bconf_id, 'Confiscado/Decomisado', con.fechasenjud::timestamp,
              con.fechahoraing::timestamp, NULL::text, con.autoridad::text,
              NULL::text, con.numsentjud::text, con.usuario::text
            FROM public.bienesconfiscados con WHERE con.itembiensec_id = b.itembiensec_id
            UNION ALL
            SELECT pd.perdom_id, 'Pérdida de Dominio', pd.fechares::timestamp,
              pd.fechahoraing::timestamp, mc.descripcion::text, pd.autoridad::text,
              NULL::text, pd.fiscalia::text, pd.usuario::text
            FROM public.perdidadominio pd
            LEFT JOIN parametricas.medida_cautelar mc ON mc.id_medida_cautelar = pd.id_medida_cautelar
            WHERE pd.itembiensec_id = b.itembiensec_id
          ) h
        ), '[]'::jsonb) AS medidas,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', sb.sitb_id::text, 'calidad', cb.descripcion, 'fecha', sb.fechaent,
            'fiscal', sb.fisreq, 'responsable', sb.responsabler,
            'institucion', sb.institucion, 'ubicacion', sb.ubicacion,
            'tipoDocumento', td.descripcion, 'numeroDocumento', sb.numero_documento
          ) ORDER BY sb.fechaent DESC NULLS LAST, sb.fechahoraing DESC NULLS LAST, sb.sitb_id DESC)
          FROM public.situacionbienes sb
          LEFT JOIN parametricas.calidadbien cb ON cb.calb_id = sb.calb_id
          LEFT JOIN parametricas.tipodoc td ON td.td_id = sb.id_tipo_documento
          WHERE sb.itembiensec_id = b.itembiensec_id
        ), '[]'::jsonb) AS custodias,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', f.fotobien_id::text, 'descripcion', f.descripcion,
            'hex', encode(f.fotografia, 'hex')
          ) ORDER BY f.fotobien_id)
          FROM public.fotobienes f
          WHERE f.itembiensec_id = b.itembiensec_id AND f.estado = 'ACTIVO'
        ), '[]'::jsonb) AS fotografias,
        COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'id', j.itembienjur_id::text, 'descripcion', j.descripcion,
            'fecha', j.fechahoraing
          ) ORDER BY j.fechahoraing DESC, j.itembienjur_id DESC)
          FROM public.itembienjuridica j
          WHERE j.itembiensec_id = b.itembiensec_id AND j.estado = 'ACTIVO'
        ), '[]'::jsonb) AS "informacionJuridica"
      FROM public.itembiensecuestrado b
      JOIN public.operativo o ON o.op_id = b.op_id
      LEFT JOIN parametricas.catalogotipo ct ON ct.cattipo_id = b.cattipo_id
      LEFT JOIN parametricas.catalogoclase cl ON cl.catclas_id = ct.catclas_id
      WHERE o.casos_id = $1::bigint AND o.estado = 'ACTIVO' AND b.estado = 'ACTIVO'
      ORDER BY o.op_fechainf, o.op_id, b.itembiensec_id
    `, [casosId])
  }
}
