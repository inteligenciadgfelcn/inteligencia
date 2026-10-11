/** Fragmentos constantes: ningún nombre SQL procede del usuario. */
export const SITUACION_PERSONA = `(SELECT s.sl_id FROM public.situacion s
  WHERE s.de_id = p.de_id AND s.estado = TRUE
  ORDER BY s.fechahoraing DESC NULLS LAST, s.sit_id DESC LIMIT 1)`

export const SITUACION_EMPRESA = `(SELECT se.id_tipo_situacion_juridica
  FROM public.situacion_juridica_empresa se WHERE se.id_empresa = e.emp_id
  ORDER BY se.fechahoraing DESC NULLS LAST, se.id_situacion_juridica_empresa DESC LIMIT 1)`

export const SITUACION_JURIDICA_BIEN = `(SELECT j.catjur_id
  FROM public.itembienjuridica j
  WHERE j.itembiensec_id = b.itembiensec_id AND j.estado = 'ACTIVO'
  ORDER BY j.fechahoraing DESC NULLS LAST, j.itembienjur_id DESC LIMIT 1)`

/** Fecha del evento e ingreso se devuelven por separado.
 * La situación actual se determina por el último ingreso (criterio del sistema).
 * El historial no incorpora situaciones de custodia como si fueran jurídicas.
 */
export const EVENTOS_LEGALES_BIEN = `
  SELECT 'SECUESTRADO'::text AS tipo, s.bsec_id AS id,
    s.itembiensec_id, s.fechaactsec::timestamptz AS fecha,
    s.fechahoraing::timestamptz AS ingreso, NULL::text AS documento
  FROM public.bienessecuestados s
  UNION ALL
  SELECT 'INCAUTADO', i.binc_id, i.itembiensec_id,
    i.fechares::timestamptz, i.fechahoraing::timestamptz, TRIM(i.nroresol)::text
  FROM public.bienesincautados i
  UNION ALL
  SELECT 'CONFISCADO', c.bconf_id, c.itembiensec_id,
    c.fechasenjud, c.fechahoraing, c.numsentjud::text
  FROM public.bienesconfiscados c
  UNION ALL
  SELECT 'PERDIDA_DOMINIO', pd.perdom_id, pd.itembiensec_id,
    pd.fechares::timestamptz, pd.fechahoraing::timestamptz, NULL::text
  FROM public.perdidadominio pd
`
export const SITUACION_LEGAL_BIEN = `(SELECT ev.tipo FROM (${EVENTOS_LEGALES_BIEN}) ev
  WHERE ev.itembiensec_id = b.itembiensec_id
  ORDER BY ev.ingreso DESC NULLS LAST, ev.tipo DESC, ev.id DESC LIMIT 1)`

export const CASO_SELECT = `a.casos_id::text AS "casosId",
  a.nrocasogiaef AS "numeroCasoGiaef", a.nombrecaso AS "nombreCaso",
  a.nrocaso AS "numeroCaso", a.nrocasofis AS "numeroCasoFiscalia",
  a.cudifp AS cud, a.fechainicio AS "fechaInicio", a.estado,
  a.dptoav_id AS "departamentoCodigo", a.uni_abrev AS "unidadAbreviada",
  u.uni_id::text AS "unidadId", u.uni_descripcion AS unidad,
  a.dis_id::text AS "distritalId", d.dis_descripcion AS distrital,
  a.id_grupo::text AS "grupoId", TRIM(g.descripcion) AS grupo,
  a.eta_inv::text AS "etapaInvestigacionId", ei.descripcion AS "etapaInvestigacion",
  a.id_estado::text AS "estadoProcesalId", TRIM(ep.descripcion) AS "estadoProcesal"`

export const CASO_FROM = `FROM public.asignacion a
  LEFT JOIN parametricas.distritales d ON d.dis_id = a.dis_id
  LEFT JOIN parametricas.unidades u ON u.uni_id = d.uni_id
  LEFT JOIN parametricas.grupos g ON g.grp_id = a.id_grupo
  LEFT JOIN parametricas.etapainvest ei ON ei.eta_inv = a.eta_inv
  LEFT JOIN parametricas.estado ep ON ep.est_id = a.id_estado`
