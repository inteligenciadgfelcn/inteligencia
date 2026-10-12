import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { FiltrosVariablesCruzadasPdDto } from './dto/filtros-variables-cruzadas.dto'
/** Fragmentos constantes: ningún nombre SQL procede del usuario. */
const SITUACION_PERSONA = `(SELECT s.sl_id FROM public.situacion s
  WHERE s.de_id = p.de_id AND s.estado = TRUE
  ORDER BY s.fechahoraing DESC NULLS LAST, s.sit_id DESC LIMIT 1)`
const SITUACION_EMPRESA = `(SELECT se.id_tipo_situacion_juridica
  FROM public.situacion_juridica_empresa se WHERE se.id_empresa = e.emp_id
  ORDER BY se.fechahoraing DESC NULLS LAST, se.id_situacion_juridica_empresa DESC LIMIT 1)`
const SITUACION_JURIDICA_BIEN = `(SELECT j.catjur_id
  FROM public.itembienjuridica j
  WHERE j.itembiensec_id = b.itembiensec_id AND j.estado = 'ACTIVO'
  ORDER BY j.fechahoraing DESC NULLS LAST, j.itembienjur_id DESC LIMIT 1)`
const EVENTOS_LEGALES_BIEN = `
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
const SITUACION_LEGAL_BIEN = `(SELECT ev.tipo FROM (${EVENTOS_LEGALES_BIEN}) ev
  WHERE ev.itembiensec_id = b.itembiensec_id
  ORDER BY ev.ingreso DESC NULLS LAST, ev.tipo DESC, ev.id DESC LIMIT 1)`
const CASO_SELECT = `a.casos_id::text AS "casosId",
  a.nrocasoperdom AS "numeroCasoGiaef",
  a.nrocasoperdom AS "numeroCasoPd", a.nombrecaso AS "nombreCaso",
  a.nrocaso AS "numeroCaso", a.nrocasofis AS "numeroCasoFiscalia",
  a.cudifp AS cud, a.fechainicio AS "fechaInicio", a.estado,
  a.dptoav_id AS "departamentoCodigo", a.uni_abrev AS "unidadAbreviada",
  u.uni_id::text AS "unidadId", u.uni_descripcion AS unidad,
  a.dis_id::text AS "distritalId", d.dis_descripcion AS distrital,
  a.id_grupo::text AS "grupoId", TRIM(g.descripcion) AS grupo,
  a.eta_inv::text AS "etapaInvestigacionId", ei.descripcion AS "etapaInvestigacion",
  a.id_estado::text AS "estadoProcesalId", TRIM(ep.descripcion) AS "estadoProcesal"`
const CASO_FROM = `FROM public.asignacion a
  LEFT JOIN parametricas.distritales d ON d.dis_id = a.dis_id
  LEFT JOIN parametricas.unidades u ON u.uni_id = d.uni_id
  LEFT JOIN parametricas.grupos g ON g.grp_id = a.id_grupo
  LEFT JOIN parametricas.etapainvest ei ON ei.eta_inv = a.eta_inv
  LEFT JOIN parametricas.estado ep ON ep.est_id = a.id_estado`
function escaparLike(texto: string): string {
  return [...texto]
    .map((c) =>
      c === '%' || c === '_' || c.charCodeAt(0) === 92
        ? String.fromCharCode(92) + c
        : c
    )
    .join('')
}
type Registro = Record<string, any>
export type ResultadoPaginadoPd = [Registro[], number]
const CRITERIO_CASO_PD =
  "a.estado = 'ACTIVO' AND a.nrocasoperdom ILIKE '%-PD-%'"

class Condiciones {
  readonly valores: unknown[] = []
  readonly caso: string[] = [CRITERIO_CASO_PD]
  parametro(valor: unknown): string {
    this.valores.push(valor)
    return `$${this.valores.length}`
  }
  texto(destino: string[], campo: string, valor?: string): void {
    if (valor?.trim()) {
      const texto = '%' + escaparLike(valor.trim()) + '%'
      destino.push(`${campo} ILIKE ${this.parametro(texto)}`)
    }
  }
  igual(destino: string[], campo: string, valor: unknown): void {
    if (valor !== undefined && valor !== null && valor !== '') {
      destino.push(`${campo} = ${this.parametro(valor)}`)
    }
  }
  situacion(
    destino: string[],
    expresion: string,
    id?: number | string,
    sin?: boolean
  ): void {
    if (sin === true) destino.push(`${expresion} IS NULL`)
    else {
      this.igual(destino, expresion, id)
      if (sin === false) destino.push(`${expresion} IS NOT NULL`)
    }
  }
  fechas(
    destino: string[],
    campo: string,
    desde?: string,
    hasta?: string
  ): void {
    // Rango inclusivo de días, interpretado como calendario de Bolivia.
    if (desde)
      destino.push(
        `${campo} >= (${this.parametro(desde)}::date::timestamp AT TIME ZONE 'America/La_Paz')`
      )
    if (hasta)
      destino.push(
        `${campo} < ((${this.parametro(hasta)}::date + 1)::timestamp AT TIME ZONE 'America/La_Paz')`
      )
  }
}
@Injectable()
export class BusquedaPdRepository {
  constructor(
    @InjectDataSource(DB_LGI) private readonly dataSource: DataSource
  ) {}
  construirFiltros(f: FiltrosVariablesCruzadasPdDto): {
    where: string
    valores: unknown[]
  } {
    const c = new Condiciones()
    for (const [campo, valor] of [
      ['a.nombrecaso', f.nombreCaso],
      ['a.cudifp', f.cud],
      ['a.nrocasofis', f.numeroCasoFiscalia],
    ] as const)
      c.texto(c.caso, campo, valor)
    for (const [campo, valor] of [
      ['a.dptoav_id', f.departamentoCodigo],
      ['d.uni_id', f.unidadId],
      ['a.dis_id', f.distritalId],
      ['a.id_grupo', f.grupoId],
      ['a.eta_inv', f.etapaInvestigacionId],
      ['a.id_estado', f.estadoProcesalId],
    ] as const)
      c.igual(c.caso, campo, valor)
    if (f.numeroCaso?.trim()) {
      const v = c.parametro('%' + escaparLike(f.numeroCaso.trim()) + '%')
      c.caso.push(
        `(a.nrocasoperdom ILIKE ${v} OR a.nrocaso ILIKE ${v} OR a.nrocasogiaef ILIKE ${v})`
      )
    }
    if (f.tipologiaId !== undefined) {
      c.caso.push(`EXISTS (SELECT 1 FROM public.caso_tipologia ct
        WHERE ct.casos_id = a.casos_id AND ct.estado = 'ACTIVO'
        AND ct.id_tipologia = ${c.parametro(f.tipologiaId)})`)
    }
    c.fechas(c.caso, 'a.fechainicio', f.inicioCasoDesde, f.inicioCasoHasta)
    const p: string[] = []
    for (const [campo, valor] of [
      ['p.de_nombres', f.nombres],
      ['p.de_paterno', f.apellidoPaterno],
      ['p.de_materno', f.apellidoMaterno],
      ['p.de_esposo', f.apellidoEsposo],
      ['p.nro_docum', f.numeroDocumento],
      ['p.relacion', f.relacionPersona],
      ['p.observaciones', f.observacionesPersona],
    ] as const)
      c.texto(p, campo, valor)
    for (const [campo, valor] of [
      ['p.pa_id', f.paisId],
      ['p.ec_id', f.estadoCivilId],
      ['p.prof_id', f.profesionId],
      ['p.td_id', f.tipoDocumentoId],
      ['p.sexo', f.sexo],
    ] as const)
      c.igual(p, campo, valor)
    c.fechas(
      p,
      'p.fechahoraing',
      f.personaRegistroDesde,
      f.personaRegistroHasta
    )
    c.situacion(
      p,
      SITUACION_PERSONA,
      f.situacionPersonaId,
      f.personaSinSituacion
    )
    if (p.length)
      c.caso.push(`EXISTS (SELECT 1 FROM public.detenidosaux p
      WHERE p.caso_id = a.casos_id AND p.estado = TRUE AND ${p.join(' AND ')})`)
    const o: string[] = []
    c.texto(o, 'o.op_nrooper', f.numeroActuacion)
    c.texto(o, 'o.op_lugar', f.lugarActuacion)
    c.igual(o, 'o.id_tipo_informe', f.tipoInformeId)
    c.fechas(o, 'o.op_fechainf', f.informeDesde, f.informeHasta)
    const b: string[] = []
    for (const [campo, valor] of [
      ['cl.bien_id', f.categoriaBienId],
      ['t.catclas_id', f.claseBienId],
      ['b.cattipo_id', f.tipoBienId],
      ['b.pericia', f.periciaBien],
    ] as const)
      c.igual(b, campo, valor)
    c.texto(b, 'b.lugar_secuestro', f.lugarSecuestro)
    c.texto(b, 'b.resultado_pericia', f.resultadoPericiaBien)
    c.fechas(b, 'b.fechahoraing', f.bienRegistroDesde, f.bienRegistroHasta)
    if (f.valorBienDesde !== undefined)
      b.push(`b.costoaprox >= ${c.parametro(f.valorBienDesde)}`)
    if (f.valorBienHasta !== undefined)
      b.push(`b.costoaprox <= ${c.parametro(f.valorBienHasta)}`)
    c.situacion(
      b,
      SITUACION_LEGAL_BIEN,
      f.situacionLegalBien,
      f.bienSinSituacionLegal
    )
    c.situacion(
      b,
      SITUACION_JURIDICA_BIEN,
      f.situacionJuridicaBienId,
      f.bienSinSituacionJuridica
    )
    const bc: string[] = []
    c.igual(bc, 'bc.catcarac_id', f.caracteristicaId)
    c.texto(bc, 'bc.descripcion', f.caracteristicaBien)
    if (bc.length)
      b.push(`EXISTS (SELECT 1 FROM public.itembiencaracteristicas bc
      WHERE bc.itembiensec_id = b.itembiensec_id AND bc.estado = 'ACTIVO'
      AND ${bc.join(' AND ')})`)
    const e: string[] = []
    for (const [campo, valor] of [
      ['e.nombre', f.nombreEmpresa],
      ['e.nit', f.nit],
      ['e.matricula', f.matricula],
      ['e.representante', f.representante],
      ['e.direccion', f.direccionEmpresa],
      ['e.resultado', f.resultadoPericiaEmpresa],
      ['e.obs', f.observacionesEmpresa],
    ] as const)
      c.texto(e, campo, valor)
    c.igual(e, 'e.id_vinculo', f.vinculoEmpresaId)
    c.igual(e, 'e.pericia', f.periciaEmpresa)
    c.situacion(
      e,
      SITUACION_EMPRESA,
      f.situacionEmpresaId,
      f.empresaSinSituacion
    )
    c.fechas(
      e,
      'e.fechahoraing',
      f.empresaRegistroDesde,
      f.empresaRegistroHasta
    )
    if (o.length)
      c.caso.push(`EXISTS (SELECT 1 FROM public.operativo o
      WHERE o.casos_id = a.casos_id AND o.estado = 'ACTIVO' AND ${o.join(' AND ')})`)
    if (b.length)
      c.caso.push(`EXISTS (SELECT 1 FROM public.operativo o
      JOIN public.itembiensecuestrado b ON b.op_id = o.op_id
      LEFT JOIN parametricas.catalogotipo t ON t.cattipo_id = b.cattipo_id
      LEFT JOIN parametricas.catalogoclase cl ON cl.catclas_id = t.catclas_id
      WHERE o.casos_id = a.casos_id AND o.estado = 'ACTIVO' AND b.estado = 'ACTIVO'
      ${o.length ? 'AND ' + o.join(' AND ') : ''} AND ${b.join(' AND ')})`)
    if (e.length)
      c.caso.push(`EXISTS (SELECT 1 FROM public.operativo o
      JOIN public.empresas e ON e.op_id = o.op_id
      WHERE o.casos_id = a.casos_id AND o.estado = 'ACTIVO'
      ${o.length ? 'AND ' + o.join(' AND ') : ''} AND ${e.join(' AND ')})`)
    if (f.filtro?.trim()) {
      const v = c.parametro('%' + escaparLike(f.filtro.trim()) + '%')
      c.caso.push(`(a.nrocasoperdom ILIKE ${v} OR a.nrocaso ILIKE ${v}
        OR a.nrocasogiaef ILIKE ${v} OR a.nombrecaso ILIKE ${v}
        OR a.cudifp ILIKE ${v} OR a.nrocasofis ILIKE ${v}
        OR EXISTS (SELECT 1 FROM public.detenidosaux p WHERE p.caso_id = a.casos_id
          AND p.estado = TRUE AND (CONCAT_WS(' ', p.de_nombres, p.de_paterno,
            p.de_materno, p.de_esposo) ILIKE ${v} OR p.nro_docum ILIKE ${v}))
        OR EXISTS (SELECT 1 FROM public.operativo o JOIN public.empresas e ON e.op_id = o.op_id
          WHERE o.casos_id = a.casos_id AND o.estado = 'ACTIVO'
          AND (e.nombre ILIKE ${v} OR e.nit ILIKE ${v}))
        OR EXISTS (SELECT 1 FROM public.operativo o
          JOIN public.itembiensecuestrado b ON b.op_id = o.op_id
          JOIN public.itembiencaracteristicas bc ON bc.itembiensec_id = b.itembiensec_id
          WHERE o.casos_id = a.casos_id AND o.estado = 'ACTIVO' AND b.estado = 'ACTIVO'
          AND bc.estado = 'ACTIVO' AND bc.descripcion ILIKE ${v}))`)
    }
    return { where: c.caso.join(' AND '), valores: c.valores }
  }
  async buscarGeneralPaginado(
    f: FiltrosVariablesCruzadasPdDto,
    pagination: PaginacionQueryDto
  ): Promise<ResultadoPaginadoPd> {
    // Tu DTO recibe pagina; saltar es su getter: (pagina - 1) * limite.
    const { limite, saltar } = pagination
    const { where, valores } = this.construirFiltros({
      ...f,
      filtro: pagination.filtro?.trim() || f.filtro,
    })
    return this.dataSource.transaction('REPEATABLE READ', async (manager) => {
      await manager.query("SET LOCAL TIME ZONE 'America/La_Paz'")
      const [conteo] = await manager.query(
        `SELECT COUNT(*)::text AS total ${CASO_FROM} WHERE ${where}`,
        valores
      )
      const casos: Registro[] = await manager.query(
        `SELECT ${CASO_SELECT}
        ${CASO_FROM} WHERE ${where} ORDER BY a.casos_id DESC
        LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`,
        [...valores, limite, saltar]
      )
      if (casos.length) {
        const ids = casos.map((c) => c.casosId)
        const personas: Registro[] = await manager.query(
          `SELECT p.caso_id::text AS "casosId",
          p.de_id::text AS "deId", CONCAT_WS(' ', NULLIF(p.de_nombres, ''),
          NULLIF(p.de_paterno, ''), NULLIF(p.de_materno, ''), NULLIF(p.de_esposo, '')) AS "nombreCompleto",
          p.nro_docum AS "numeroDocumento" FROM public.detenidosaux p
          WHERE p.caso_id = ANY($1::bigint[]) AND p.estado = TRUE ORDER BY p.de_id`,
          [ids]
        )
        const totales: Registro[] = await manager.query(
          `SELECT o.casos_id::text AS "casosId",
          COUNT(*)::int AS actuaciones,
          (SELECT COUNT(*)::int FROM public.itembiensecuestrado b JOIN public.operativo ob ON ob.op_id = b.op_id
            WHERE ob.casos_id = o.casos_id AND ob.estado = 'ACTIVO' AND b.estado = 'ACTIVO') AS "registrosBienes",
          (SELECT COALESCE(SUM(b.cantidadbien), 0)::text FROM public.itembiensecuestrado b
            JOIN public.operativo ob ON ob.op_id = b.op_id
            WHERE ob.casos_id = o.casos_id AND ob.estado = 'ACTIVO' AND b.estado = 'ACTIVO') AS "cantidadBienes",
          (SELECT COUNT(*)::int FROM public.empresas e JOIN public.operativo oe ON oe.op_id = e.op_id
            WHERE oe.casos_id = o.casos_id AND oe.estado = 'ACTIVO') AS empresas
          FROM public.operativo o WHERE o.casos_id = ANY($1::bigint[]) AND o.estado = 'ACTIVO'
          GROUP BY o.casos_id`,
          [ids]
        )
        const porCaso = new Map(totales.map((r) => [r.casosId, r]))
        const personasPorCaso = new Map<string, Registro[]>()
        for (const p of personas) {
          const lista = personasPorCaso.get(p.casosId) ?? []
          lista.push(p)
          personasPorCaso.set(p.casosId, lista)
        }
        for (const caso of casos) {
          caso.personasInvestigadas = personasPorCaso.get(caso.casosId) ?? []
          const t = porCaso.get(caso.casosId)
          caso.totales = {
            personas: caso.personasInvestigadas.length,
            actuaciones: t?.actuaciones ?? 0,
            registrosBienes: t?.registrosBienes ?? 0,
            cantidadBienes: t?.cantidadBienes ?? '0',
            empresas: t?.empresas ?? 0,
          }
        }
      }
      return [casos, Number(conteo.total)]
    })
  }
  async obtenerDetalle(casosId: string): Promise<Registro | null> {
    return this.dataSource.transaction('REPEATABLE READ', async (manager) => {
      await manager.query("SET LOCAL TIME ZONE 'America/La_Paz'")
      return this.obtenerDetalleConManager(manager, casosId)
    })
  }
  async obtenerFilasExportacion(
    f: FiltrosVariablesCruzadasPdDto
  ): Promise<Registro[]> {
    const { where, valores } = this.construirFiltros(f)
    return this.dataSource.transaction('REPEATABLE READ', async (manager) => {
      await manager.query("SET LOCAL TIME ZONE 'America/La_Paz'")
      const casos: Registro[] = await manager.query(
        `SELECT a.casos_id::text AS "casosId" ${CASO_FROM} WHERE ${where} ORDER BY a.casos_id DESC`,
        valores
      )
      const filas: Registro[] = []
      for (const caso of casos) {
        const detalle = await this.obtenerDetalleConManager(
          manager,
          caso.casosId
        )
        if (detalle) filas.push(detalle)
      }
      return filas
    })
  }
  private async obtenerDetalleConManager(
    manager: EntityManager,
    casosId: string
  ): Promise<Registro | null> {
    const [caso] = await manager.query(
      `SELECT ${CASO_SELECT} ${CASO_FROM}
      WHERE a.casos_id = $1::bigint AND ${CRITERIO_CASO_PD}`,
      [casosId]
    )
    if (!caso) return null
    const personas = await this.cargarPersonas(manager, casosId)
    const actuaciones: Registro[] = await manager.query(
      `SELECT o.op_id::text AS "opId",
      o.op_nrooper AS "numeroActuacion", o.op_fechainf AS "fechaInforme",
      o.op_lugar AS lugar, o.op_descripcion AS descripcion,
      o.id_tipo_informe::text AS "tipoInformeId", ti.descripcion AS "tipoInforme",
      o.otro_informe AS "otroInforme" FROM public.operativo o
      LEFT JOIN parametricas.tipo_informe ti ON ti.id = o.id_tipo_informe
      WHERE o.casos_id = $1 AND o.estado = 'ACTIVO' ORDER BY o.op_id DESC`,
      [casosId]
    )
    for (const o of actuaciones) {
      o.bienes = []
      o.empresas = []
    }
    const opIds = actuaciones.map((o) => o.opId)
    if (opIds.length) {
      const bienes = await this.cargarBienes(manager, opIds)
      const empresas = await this.cargarEmpresas(manager, opIds)
      const bienesPorOp = new Map<string, Registro[]>()
      const empresasPorOp = new Map<string, Registro[]>()
      for (const [registros, mapa] of [
        [bienes, bienesPorOp],
        [empresas, empresasPorOp],
      ] as const) {
        for (const registro of registros) {
          const lista = mapa.get(registro.opId) ?? []
          lista.push(registro)
          mapa.set(registro.opId, lista)
        }
      }
      for (const o of actuaciones) {
        o.bienes = bienesPorOp.get(o.opId) ?? []
        o.empresas = empresasPorOp.get(o.opId) ?? []
      }
    }
    return { ...caso, personasInvestigadas: personas, actuaciones }
  }
  private async cargarPersonas(
    m: EntityManager,
    casosId: string
  ): Promise<Registro[]> {
    return m.query(
      `SELECT p.de_id::text AS "deId", p.de_nombres AS nombres,
      p.de_paterno AS "apellidoPaterno", p.de_materno AS "apellidoMaterno", p.de_esposo AS "apellidoEsposo",
      CONCAT_WS(' ', NULLIF(p.de_nombres,''), NULLIF(p.de_paterno,''), NULLIF(p.de_materno,''), NULLIF(p.de_esposo,'')) AS "nombreCompleto",
      p.nro_docum AS "numeroDocumento", p.td_id::text AS "tipoDocumentoId", td.descripcion AS "tipoDocumento",
      p.sexo, p.pa_id::text AS "paisId", pa.descripcion AS pais, ec.descripcion AS "estadoCivil",
      pr.descripcion AS profesion, p.relacion, p.observaciones, p.fechahoraing AS "fechaRegistro",
      ${SITUACION_PERSONA}::text AS "situacionJuridicaActualId",
      (SELECT TRIM(sl.descripcion) FROM parametricas.situacionlegal sl
        WHERE sl.sl_id = ${SITUACION_PERSONA}) AS "situacionJuridicaActual",
      COALESCE((SELECT jsonb_agg(jsonb_build_object('sitId', s.sit_id::text,
        'situacionId', s.sl_id::text, 'descripcion', TRIM(sl.descripcion), 'fecha', s.fecha,
        'fechaRegistro', s.fechahoraing, 'numeroResolucion', s.nroresolucion,
        'autoridad', s.autoridad, 'lugar', s.lugar)
        ORDER BY s.fechahoraing DESC NULLS LAST, s.sit_id DESC)
        FROM public.situacion s LEFT JOIN parametricas.situacionlegal sl ON sl.sl_id = s.sl_id
        WHERE s.de_id = p.de_id AND s.estado = TRUE), '[]'::jsonb) AS "historialSituaciones"
      FROM public.detenidosaux p LEFT JOIN parametricas.pais pa ON pa.pa_id = p.pa_id
      LEFT JOIN parametricas.estadocivil ec ON ec.ec_id = p.ec_id
      LEFT JOIN parametricas.profesion pr ON pr.prof_id = p.prof_id
      LEFT JOIN parametricas.tipodoc td ON td.td_id = p.td_id
      WHERE p.caso_id = $1 AND p.estado = TRUE ORDER BY p.de_id`,
      [casosId]
    )
  }
  private async cargarBienes(
    m: EntityManager,
    opIds: string[]
  ): Promise<Registro[]> {
    return m.query(
      `SELECT b.itembiensec_id::text AS "itemBienSecId", b.op_id::text AS "opId",
      b.cattipo_id::text AS "tipoBienId", t.descripcion AS tipo, cl.descripcion AS clase,
      ca.descripcion AS categoria, b.cantidadbien AS cantidad, b.costoaprox AS "valorAproximado",
      b.costocuant AS "valorCuantificado", b.lugar_secuestro AS "lugarSecuestro", b.latitud, b.longitud,
      b.inves AS "enInvestigacion", b.pericia, b.resultado_pericia AS "resultadoPericia", b.fechahoraing AS "fechaRegistro",
      ${SITUACION_LEGAL_BIEN} AS "situacionLegalActual",
      ${SITUACION_JURIDICA_BIEN}::text AS "situacionJuridicaActualId",
      (SELECT j.descripcion FROM public.itembienjuridica j WHERE j.itembiensec_id = b.itembiensec_id
        AND j.estado = 'ACTIVO' ORDER BY j.fechahoraing DESC NULLS LAST, j.itembienjur_id DESC LIMIT 1) AS "situacionJuridicaActual",
      COALESCE((SELECT jsonb_agg(jsonb_build_object('id', bc.itembiencar_id::text,
        'caracteristicaId', bc.catcarac_id::text, 'caracteristica', cc.descripcion, 'valor', bc.descripcion)
        ORDER BY bc.itembiencar_id) FROM public.itembiencaracteristicas bc
        LEFT JOIN parametricas.catalogocaracteristicas cc ON cc.catcarac_id = bc.catcarac_id
        WHERE bc.itembiensec_id = b.itembiensec_id AND bc.estado = 'ACTIVO'), '[]'::jsonb) AS caracteristicas,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('id', ev.id::text, 'tipo', ev.tipo,
        'fecha', ev.fecha, 'fechaRegistro', ev.ingreso, 'documento', ev.documento)
        ORDER BY ev.ingreso DESC NULLS LAST, ev.tipo DESC, ev.id DESC)
        FROM (${EVENTOS_LEGALES_BIEN}) ev WHERE ev.itembiensec_id = b.itembiensec_id), '[]'::jsonb) AS "historialLegal",
      COALESCE((SELECT jsonb_agg(jsonb_build_object('id', j.itembienjur_id::text,
        'situacionId', j.catjur_id::text, 'descripcion', j.descripcion, 'fechaRegistro', j.fechahoraing)
        ORDER BY j.fechahoraing DESC NULLS LAST, j.itembienjur_id DESC)
        FROM public.itembienjuridica j WHERE j.itembiensec_id = b.itembiensec_id
        AND j.estado = 'ACTIVO'), '[]'::jsonb) AS "historialJuridico"
      FROM public.itembiensecuestrado b
      LEFT JOIN parametricas.catalogotipo t ON t.cattipo_id = b.cattipo_id
      LEFT JOIN parametricas.catalogoclase cl ON cl.catclas_id = t.catclas_id
      LEFT JOIN parametricas.bienes ca ON ca.bien_id = cl.bien_id
      WHERE b.op_id = ANY($1::bigint[]) AND b.estado = 'ACTIVO' ORDER BY b.itembiensec_id`,
      [opIds]
    )
  }
  private async cargarEmpresas(
    m: EntityManager,
    opIds: string[]
  ): Promise<Registro[]> {
    return m.query(
      `SELECT e.emp_id::text AS "empId", e.op_id::text AS "opId", e.nombre, e.nit,
      e.matricula, e.representante, e.direccion, e.capital_social AS "capitalSocial", e.obs AS observaciones,
      e.pericia, e.resultado AS "resultadoPericia", e.documento, e.latitud, e.longitud,
      e.id_vinculo::text AS "vinculoId", v.descripcion AS vinculo, e.fechahoraing AS "fechaRegistro",
      ${SITUACION_EMPRESA}::text AS "situacionJuridicaActualId",
      (SELECT sj.descripcion FROM parametricas.tipo_situacion_juridica sj
        WHERE sj.id_tipo_situacion_juridica = ${SITUACION_EMPRESA}) AS "situacionJuridicaActual",
      COALESCE((SELECT jsonb_agg(jsonb_build_object('id', se.id_situacion_juridica_empresa::text,
        'situacionId', se.id_tipo_situacion_juridica::text, 'descripcion', sj.descripcion,
        'fecha', se.fecha, 'fechaRegistro', se.fechahoraing)
        ORDER BY se.fechahoraing DESC NULLS LAST, se.id_situacion_juridica_empresa DESC)
        FROM public.situacion_juridica_empresa se
        LEFT JOIN parametricas.tipo_situacion_juridica sj ON sj.id_tipo_situacion_juridica = se.id_tipo_situacion_juridica
        WHERE se.id_empresa = e.emp_id), '[]'::jsonb) AS "historialSituaciones"
      FROM public.empresas e LEFT JOIN parametricas.vinculo v ON v.id_vinculo = e.id_vinculo
      WHERE e.op_id = ANY($1::bigint[]) ORDER BY e.emp_id`,
      [opIds]
    )
  }
  async obtenerCatalogos(): Promise<Registro> {
    return this.dataSource.transaction('REPEATABLE READ', async (m) => {
      const consultas: Record<string, string> = {
        departamentos: `SELECT DISTINCT a.dptoav_id AS codigo FROM public.asignacion a
          WHERE ${CRITERIO_CASO_PD} ORDER BY codigo`,
        unidades: `SELECT uni_id::text AS id, uni_descripcion AS descripcion FROM parametricas.unidades ORDER BY descripcion`,
        distritales: `SELECT dis_id::text AS id, dis_descripcion AS descripcion, uni_id::text AS "unidadId" FROM parametricas.distritales ORDER BY descripcion`,
        grupos: `SELECT grp_id::text AS id, TRIM(descripcion) AS descripcion, dis_id::text AS "distritalId" FROM parametricas.grupos ORDER BY descripcion`,
        etapasInvestigacion: `SELECT eta_inv::text AS id, descripcion FROM parametricas.etapainvest`,
        estadosProcesales: `SELECT est_id::text AS id, TRIM(descripcion) AS descripcion, et_id::text AS "etapaId" FROM parametricas.estado ORDER BY descripcion`,
        tipologias: `SELECT id_tipologia::text AS id, descripcion FROM parametricas.tipologia ORDER BY descripcion`,
        tiposInforme: `SELECT id::text AS id, descripcion FROM parametricas.tipo_informe ORDER BY descripcion`,
        paises: `SELECT pa_id::text AS id, descripcion FROM parametricas.pais WHERE estado = 'ACTIVO' ORDER BY descripcion`,
        estadosCiviles: `SELECT ec_id::text AS id, descripcion FROM parametricas.estadocivil ORDER BY descripcion`,
        profesiones: `SELECT prof_id::text AS id, descripcion FROM parametricas.profesion ORDER BY descripcion`,
        tiposDocumento: `SELECT td_id::text AS id, descripcion FROM parametricas.tipodoc ORDER BY descripcion`,
        situacionesPersona: `SELECT sl_id::text AS id, TRIM(descripcion) AS descripcion FROM parametricas.situacionlegal ORDER BY descripcion`,
        categoriasBien: `SELECT bien_id::text AS id, descripcion FROM parametricas.bienes ORDER BY descripcion`,
        clasesBien: `SELECT catclas_id::text AS id, descripcion, bien_id::text AS "categoriaId" FROM parametricas.catalogoclase ORDER BY descripcion`,
        tiposBien: `SELECT cattipo_id::text AS id, descripcion, catclas_id::text AS "claseId" FROM parametricas.catalogotipo ORDER BY descripcion`,
        caracteristicas: `SELECT catcarac_id::text AS id, descripcion, catclas_id::text AS "claseId" FROM parametricas.catalogocaracteristicas ORDER BY descripcion`,
        situacionesJuridicasBien: `SELECT catjur_id::text AS id,
          STRING_AGG(DISTINCT descripcion, ' / ' ORDER BY descripcion) AS descripcion
          FROM public.itembienjuridica WHERE estado = 'ACTIVO' GROUP BY catjur_id ORDER BY catjur_id`,
        situacionesEmpresa: `SELECT id_tipo_situacion_juridica::text AS id, descripcion FROM parametricas.tipo_situacion_juridica ORDER BY descripcion`,
        vinculosEmpresa: `SELECT id_vinculo::text AS id, descripcion FROM parametricas.vinculo WHERE empresa IS DISTINCT FROM FALSE ORDER BY descripcion`,
      }
      const resultado: Registro = {}
      for (const [nombre, sql] of Object.entries(consultas))
        resultado[nombre] = await m.query(sql)
      resultado.situacionesLegalesBien = [
        { id: 'SECUESTRADO', descripcion: 'Secuestrado' },
        { id: 'INCAUTADO', descripcion: 'Incautado' },
        { id: 'CONFISCADO', descripcion: 'Confiscado' },
        { id: 'PERDIDA_DOMINIO', descripcion: 'Pérdida de dominio' },
      ]
      return resultado
    })
  }
}
