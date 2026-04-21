export interface AntecedentesSearchFormValues {
  ci: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
}

export interface AntecedentesSearchParams {
  ci?: string
  nombre?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
}

export interface AntecedenteItem {
  nombreCompleto: string
  ci: string
  cantidadOperativos: number
  tieneAntecedentes: boolean
}

export interface AntecedentesResponse {
  encontrado: boolean
  data: AntecedenteItem[]
}
