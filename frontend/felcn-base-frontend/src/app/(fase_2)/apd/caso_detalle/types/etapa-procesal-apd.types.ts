export interface EtapaCatalogo {
  etId: number
  descripcion: string
  lgi?: boolean
}

export interface EstadoEtapa {
  estId: number
  etId: number
  descripcion: string
}

export interface RegistrarEtapaProcesalPayload {
  etapaId: number
  fechaEtapa: string
  diasOtorgados: number
  formalizacionAccion?: string
  descripcionDocumento?: string
}

export interface EtapaProcesalRow {
  docCasoId: number
  descripcion: string
  nombreArchivo: string
  mimeType: string | null
  contenidoBase64: string | null
  dataUrl: string | null
}