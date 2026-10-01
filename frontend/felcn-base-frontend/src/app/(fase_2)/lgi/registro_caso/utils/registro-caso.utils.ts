import dayjs from 'dayjs'

import type {
  DatosGeneralesFormValues,
  PersonaImplicadaFormValues,
  SituacionJuridicaFormValues,
} from '../types/registro-caso.types'

export const createDefaultDatosGeneralesValues =
  (): DatosGeneralesFormValues => ({
    disId: null,
    idGrupo: null,
    departamento: null,
    nombreCaso: '',
    nroCaso: '',
    nroCasoFis: '',
    remiteFiscal: '',
    conformeA: '',
    controlJurisdiccional: '',
    fechaInicio: dayjs().format('YYYY-MM-DD'),
    inicioCaso: null,
    codigoServicio: '',
  })

export const createDefaultPersonaValues = (): PersonaImplicadaFormValues => ({
  nombres: '',
  paterno: '',
  materno: '',
  esposo: '',
  paisId: null,
  estadoCivilId: null,
  profesionId: null,
  tipoDocumentoId: null,
  numeroDocumento: '',
})

export const createDefaultSituacionJuridicaValues =
  (): SituacionJuridicaFormValues => ({
    situacionLegalId: null,
    fecha: dayjs().format('YYYY-MM-DD'),
    numeroResolucion: '',
    lugar: '',
    autoridad: '',
    fjt: '',
  })
