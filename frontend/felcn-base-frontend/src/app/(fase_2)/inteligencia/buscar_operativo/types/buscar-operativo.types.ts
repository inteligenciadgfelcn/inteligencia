export interface BuscarOperativoFormValues {
  numeroCaso: string
}

export interface BienSecuestradoItem {
  tipo_bien: string
  cantidad: number
}

export interface DetenidoItem {
  id_persona_auxiliar: number
  nombre_completo: string
  nro_documento: string
  estado: string
}

export interface DrogaItem {
  tipo_droga: string
  tipo_transporte: string
  cantidad: number
  capsulas: number
}

export interface SustanciaLiquidaItem {
  sustancia_liquida: string
  cantidad: number
}

export interface SustanciaSolidaItem {
  sustancia_solida: string
  cantidad: number
}

export interface VehiculoItem {
  tipo_vehiculo: string
  placa: string
  color: string
  marca: string
}

export interface OperativoDetalleResponse {
  nombre_caso: string
  numero_caso: string
  asignado_caso: string
  fiscal_asignado_caso: string
  fecha_operativo: string
  descripcion: string
  departamento: string
  provincia: string
  localidad: string
  lugar: string
  categoria_operativo: string
  item_operativo: string
  mando: string
  unidad: string
  bienes_secuestrados: BienSecuestradoItem[]
  detenidos: DetenidoItem[]
  drogas: DrogaItem[]
  sustancia_liquida: SustanciaLiquidaItem[]
  sustancia_solida: SustanciaSolidaItem[]
  vehiculo: VehiculoItem[]
}
