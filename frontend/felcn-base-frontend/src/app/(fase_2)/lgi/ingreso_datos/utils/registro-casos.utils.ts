import dayjs from 'dayjs'

import type {
  FuncionarioCatalogItem,
  RegistroCasosFormValues,
} from '../types/registro-casos.types'

export const CURRENT_YEAR = dayjs().format('YYYY')

export const createDefaultRegistroCasosValues =
  (): RegistroCasosFormValues => ({
    regional: null,
    grupo: null,
    asignadoAlCaso: [],
    departamento: null,
    nombreCaso: '',
    tipoCaso: null,
    nroAsignadoFelcn: '',
    cudFiscalia: '',
    tipoDelito: null,
    nroCasoInvFinancieraParalela: '',
    cudDelitoPrecedente: '',
    casoPorPerdidaDominio: 'no',
    nroCasoPerdidaDominio: '',
    memorandumNro: '',
    fechaAsignacionCaso: dayjs().format('YYYY-MM-DD'),
    inicioCasoLgi: null,
    remitidoGiaefFecha: dayjs().format('YYYY-MM-DD'),
    gestion: CURRENT_YEAR,
  })

export const formatFuncionarioLabel = (item: FuncionarioCatalogItem) =>
  `${item.nroPase} - ${item.grado} ${item.nombre} ${item.paterno} ${item.materno}`
    .replace(/\s+/g, ' ')
    .trim()

export const generarCodigoCaso = (
  values: Pick<RegistroCasosFormValues, 'regional' | 'grupo' | 'gestion'>
) => {
  const regional = values.regional?.value ?? 'SIN-REG'
  const grupo = values.grupo?.value ?? 'SIN-GRU'
  const stamp = dayjs().format('HHmmss')

  return `LGI-${values.gestion}-${regional}-${grupo}-${stamp}`
}
