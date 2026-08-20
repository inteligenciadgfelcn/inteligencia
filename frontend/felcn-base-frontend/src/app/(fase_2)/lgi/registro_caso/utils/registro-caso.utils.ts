import dayjs from 'dayjs'

import type { AsignacionCasoListadoRow } from '../../listado_casos/types/listado-casos.types'
import type {
  DatosGeneralesFormValues,
  PersonaImplicadaFormValues,
  SituacionJuridicaFormValues,
} from '../types/registro-caso.types'

const STORAGE_KEY = 'lgi-caso-actual'

export const guardarCasoEnStorage = (caso: AsignacionCasoListadoRow) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(caso))
  }
}

export const leerCasoDeStorage = (): AsignacionCasoListadoRow | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AsignacionCasoListadoRow) : null
  } catch {
    return null
  }
}

export const limpiarCasoDeStorage = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

export const createDefaultDatosGeneralesValues =
  (): DatosGeneralesFormValues => ({
    disId: null,
    idGrupo: null,
    departamento: null,
    nombreCaso: '',
    nroCaso: '',
    cudIfp: '',
    remiteFiscal: '',
    conformeA: '',
    controlJurisdiccional: '',
  })

export const createDefaultPersonaValues = (): PersonaImplicadaFormValues => ({
  nombres: '',
  paterno: '',
  materno: '',
  esposo: '',
  tipoDocumentoId: null,
  numeroDocumento: '',
})

export const createDefaultSituacionJuridicaValues =
  (): SituacionJuridicaFormValues => ({
    situacionLegalId: null,
    fecha: dayjs().format('YYYY-MM-DD'),
  })
