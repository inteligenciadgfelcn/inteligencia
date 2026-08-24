import type {
  EstadoCivilLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'
import type { SituacionJuridicaRow } from '../types/personas-investigadas.types'

export const resolverPais = (catalogo: PaisLgi[], id?: number): string => {
  if (!id) return '-'
  return catalogo.find((c) => String(c.pa_id) === String(id))?.descripcion ?? '-'
}

export const resolverEstadoCivil = (
  catalogo: EstadoCivilLgi[],
  id?: number
): string => {
  if (!id) return '-'
  return catalogo.find((c) => String(c.ec_id) === String(id))?.descripcion ?? '-'
}

export const resolverProfesion = (
  catalogo: ProfesionLgi[],
  id?: number
): string => {
  if (!id) return '-'
  return (
    catalogo.find((c) => String(c.prof_id) === String(id))?.descripcion ?? '-'
  )
}

export const resolverTipoDocumento = (
  catalogo: TipoDocumentoLgi[],
  id?: number
): string => {
  if (!id) return '-'
  return catalogo.find((c) => String(c.td_id) === String(id))?.descripcion ?? '-'
}

export const obtenerUltimaSituacionJuridica = (
  situaciones: SituacionJuridicaRow[]
): SituacionJuridicaRow | null => {
  if (!situaciones.length) return null
  return [...situaciones].sort((a, b) => {
    const fechaDiff = (b.fecha ?? '').localeCompare(a.fecha ?? '')
    if (fechaDiff !== 0) return fechaDiff
    return (b.situacionJuridicaId ?? 0) - (a.situacionJuridicaId ?? 0)
  })[0]
}
