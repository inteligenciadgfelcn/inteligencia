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

export interface Operativo {
  numero_operativo: string
  nombre_caso: string
  asignado_caso: string
  telefono_asignado: string
}

export interface AntecedenteItem {
  nombreCompleto: string
  ci: string
  cantidadOperativos: number
  tieneAntecedentes: boolean
  operativos: Operativo[]
}

export interface AntecedentesResponse {
  encontrado: boolean
  data: AntecedenteItem[]
}
