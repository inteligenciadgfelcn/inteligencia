export interface PersonaJuridica {
  id: number
  casosId: number
  nombreRazonSocial: string
  nit: string
  matricula: string
  propietarioSocios: string
  representanteLegal: string
  beneficiariosFinales: string
  capitalSocial: number
  direccion: string
  latitud: number | null
  longitud: number | null
  vinculoInvestigacion: string
  situacionJuridica: string
  fechaSituacionJuridica: string
  pericia: boolean
  resultadoPericia: string
  fechaHoraIng: string
  usuario: string
}

export const VINCULOS_INVESTIGACION = [
  'Identificada',
  'Investigada con responsabilidad',
] as const

export const VALORES_POR_DEFECTO_PJ: Omit<PersonaJuridica, 'id' | 'casosId'> = {
  nombreRazonSocial: '',
  nit: '',
  matricula: '',
  propietarioSocios: '',
  representanteLegal: '',
  beneficiariosFinales: '',
  capitalSocial: 0,
  direccion: '',
  latitud: null,
  longitud: null,
  vinculoInvestigacion: '',
  situacionJuridica: '',
  fechaSituacionJuridica: '',
  pericia: false,
  resultadoPericia: '',
  fechaHoraIng: '',
  usuario: '_usuario_actual',
}
