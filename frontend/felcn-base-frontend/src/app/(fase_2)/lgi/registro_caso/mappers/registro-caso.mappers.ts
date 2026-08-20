import type {
  CatalogoLgi,
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'
import type {
  CatalogOption,
  DatosGeneralesPayload,
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
  PersonaImplicadaShortPayload,
  SituacionLegalCatalogo,
} from '../types/registro-caso.types'

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

export const CODIGO_DEPARTAMENTO: Record<string, string> = {
  'LA PAZ': 'LP',
  COCHABAMBA: 'CB',
  'SANTA CRUZ': 'SC',
  BENI: 'BE',
  POTOSÍ: 'PO',
  ORURO: 'OR',
  CHUQUISACA: 'CH',
  TARIJA: 'TA',
  PANDO: 'PA',
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
  cudIfp: string
  remiteFiscal: string
  controlJurisdiccional: string
}): DatosGeneralesPayload => ({
  disId: Number(values.disId?.value ?? 0),
  idGrupo: Number(values.idGrupo?.value ?? 0),
  dptoavId: values.departamento?.value ?? '',
  conformeA: values.conformeA,
  nombreCaso: values.nombreCaso,
  nroCaso: values.nroCaso,
  cudIfp: values.cudIfp,
  remiteFiscal: values.remiteFiscal,
  controlJurisdiccional: values.controlJurisdiccional,
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
