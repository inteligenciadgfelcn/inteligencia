import type {
  CatalogoLgi,
  DepartamentoLgi,
  DistritalLgi,
  EstadoCivilLgi,
  GrupoLgi,
  InicioCasoLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas-apd.types'
import type {
  CatalogOption,
  DatosGeneralesPayload,
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
  PersonaImplicadaShortPayload,
  SituacionLegalCatalogo,
} from '../types/registro-caso-apd.types'
import type { InvestigadorGeneralRow } from '../types/investigadores-apd.types'

export const mapCatalogoToOption = (
  item: CatalogoLgi
): CatalogOption<CatalogoLgi> => ({
  value: String(item.id),
  label: item.descripcion,
  original: item,
})

export const mapTipoDocumentoToOption = (
  item: TipoDocumentoLgi
): CatalogOption<TipoDocumentoLgi> => ({
  value: item.td_id,
  label: item.descripcion,
  original: item,
})

export const mapPaisToOption = (
  item: PaisLgi
): CatalogOption<PaisLgi> => ({
  value: item.idPais,
  label: item.descripcion,
  original: item,
})

export const mapEstadoCivilToOption = (
  item: EstadoCivilLgi
): CatalogOption<EstadoCivilLgi> => ({
  value: item.ec_id,
  label: item.descripcion,
  original: item,
})

export const mapProfesionToOption = (
  item: ProfesionLgi
): CatalogOption<ProfesionLgi> => ({
  value: item.prof_id,
  label: item.descripcion,
  original: item,
})

export const mapDistritalToOption = (
  item: DistritalLgi
): CatalogOption<DistritalLgi> => ({
  value: String(item.id),
  label: item.descripcion,
  original: item,
})

export const mapGrupoToOption = (item: GrupoLgi): CatalogOption<GrupoLgi> => ({
  value: String(item.id),
  label: item.descripcion,
  original: item,
})

export const mapInicioCasoToOption = (
  item: InicioCasoLgi
): CatalogOption<InicioCasoLgi> => ({
  value: String(item.id_inicio_caso),
  label: item.descripcion,
  original: item,
})

export const mapInvestigadorToOption = (
  item: InvestigadorGeneralRow
): CatalogOption<InvestigadorGeneralRow> => ({
  value: item.investigador,
  label: `${item.investigador} / ${item.numero_pase}`,
  original: item,
})

export const CODIGO_DEPARTAMENTO: Record<string, string> = {
  'LA PAZ': 'LP',
  COCHABAMBA: 'CB',
  'SANTA CRUZ': 'SC',
  BENI: 'BN',
  POTOSÍ: 'PT',
  ORURO: 'OR',
  CHUQUISACA: 'CH',
  TARIJA: 'TJ',
  PANDO: 'PN',
}

export const DEPARTAMENTO_POR_CODIGO: Record<string, string> = {
  LP: 'La Paz',
  CB: 'Cochabamba',
  SC: 'Santa Cruz',
  BN: 'Beni',
  PT: 'Potosí',
  OR: 'Oruro',
  CH: 'Chuquisaca',
  TJ: 'Tarija',
  PN: 'Pando',
}

export const codigoDepartamento = (item: DepartamentoLgi): string =>
  CODIGO_DEPARTAMENTO[item.descripcion.trim().toUpperCase()] ??
  item.descripcion.trim().toUpperCase()

export const mapDepartamentoToOption = (
  item: DepartamentoLgi
): CatalogOption<DepartamentoLgi> => ({
  value: codigoDepartamento(item),
  label: item.descripcion,
  original: item,
})

export const mapSituacionLegalToOption = (
  item: SituacionLegalCatalogo
): CatalogOption<SituacionLegalCatalogo> => ({
  value: String(item.slId),
  label: item.descripcion,
  original: item,
})

/**
 * Normaliza texto para comparar descripciones que vienen del backend contra las
 * de los catálogos: el backend guarda las descripciones sin acentos
 * (ej. "Bulo Bulo", "Remision Fiscalia") mientras que `parametricas.inicio_caso`
 * sí las tiene.
 */
export const normalizarTexto = (valor: string | null | undefined): string =>
  (valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()

export const buscarDistritalPorId = (
  distritales: DistritalLgi[],
  disId: string | number | null | undefined
): CatalogOption<DistritalLgi> | null => {
  if (disId === null || disId === undefined || disId === '') return null
  const match = distritales.find((item) => String(item.id) === String(disId))
  return match ? mapDistritalToOption(match) : null
}

export const buscarGrupoPorDescripcion = (
  grupos: GrupoLgi[],
  descripcion: string | null | undefined
): CatalogOption<GrupoLgi> | null => {
  const objetivo = normalizarTexto(descripcion)
  if (!objetivo) return null
  const match = grupos.find(
    (item) => normalizarTexto(item.descripcion) === objetivo
  )
  return match ? mapGrupoToOption(match) : null
}

export const buscarInicioCasoPorDescripcion = (
  iniciosCaso: InicioCasoLgi[],
  descripcion: string | null | undefined
): CatalogOption<InicioCasoLgi> | null => {
  const objetivo = normalizarTexto(descripcion)
  if (!objetivo) return null
  const match = iniciosCaso.find(
    (item) => normalizarTexto(item.descripcion) === objetivo
  )
  return match ? mapInicioCasoToOption(match) : null
}

export const formatNombreCompleto = (row: PersonaImplicadaRow) =>
  `${row.nombres} ${row.paterno} ${row.materno}`.replace(/\s+/g, ' ').trim()

export const buscarDescripcion = (
  catalogo: Array<CatalogoLgi | TipoDocumentoLgi | SituacionLegalCatalogo>,
  id: string | number
): string => {
  const item = catalogo.find((entry) => {
    if ('id' in entry) return String(entry.id) === String(id)
    if ('td_id' in entry) return String(entry.td_id) === String(id)
    return String((entry as SituacionLegalCatalogo).slId) === String(id)
  })
  return item?.descripcion ?? '-'
}

export const buildDatosGeneralesPayload = (values: {
  disId: { value: string } | null
  idGrupo: { value: string } | null
  departamento: { value: string } | null
  conformeA: string
  nombreCaso: string
  nroCaso: string
  nroCasoFis: string
  remiteFiscal: string
  controlJurisdiccional: string
  fechaInicio: string
  inicioCaso: { label: string } | null
  codigoServicio: string
}): DatosGeneralesPayload => ({
  disId: Number(values.disId?.value ?? 0),
  idGrupo: Number(values.idGrupo?.value ?? 0),
  dptoavId: values.departamento?.value ?? '',
  conformeA: values.conformeA,
  nombreCaso: values.nombreCaso,
  nroCaso: values.nroCaso,
  nroCasoFis: values.nroCasoFis,
  remiteFiscal: values.remiteFiscal,
  // El backend descarta `controlJurisdiccional` y su DTO lo declara con
  // `@IsNotEmpty()`: enviarlo vacío haría fallar el PATCH, así que se omite.
  ...(values.controlJurisdiccional.trim()
    ? { controlJurisdiccional: values.controlJurisdiccional.trim() }
    : {}),
  fechaInicio: values.fechaInicio,
  inicioCaso: values.inicioCaso?.label ?? '',
  codigoServicio: values.codigoServicio,
})

export const buildPersonaPayload = (
  casoId: number,
  values: {
    nombres: string
    paterno?: string
    materno?: string
    esposo?: string
    numeroDocumento: string
    paisId: { value: string } | null
    estadoCivilId: { value: string } | null
    profesionId: { value: string } | null
    tipoDocumentoId: { value: string } | null
  }
): PersonaImplicadaPayload => ({
  casoId,
  nombres: values.nombres,
  paterno: values.paterno || undefined,
  materno: values.materno || undefined,
  esposo: values.esposo || undefined,
  paisId: Number(values.paisId?.value ?? 0),
  estadoCivilId: Number(values.estadoCivilId?.value ?? 0),
  profesionId: Number(values.profesionId?.value ?? 0),
  tipoDocumentoId: Number(values.tipoDocumentoId?.value ?? 0),
  numeroDocumento: values.numeroDocumento,
})
