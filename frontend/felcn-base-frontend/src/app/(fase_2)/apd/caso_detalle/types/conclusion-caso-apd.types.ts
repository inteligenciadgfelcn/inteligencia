export interface SeleccionConclusion {
  id: string
  descripcion: string
}

export interface ConclusionCasoActual {
  casosId: number
  bienesSujetosPd: SeleccionConclusion[]
  sentencias: SeleccionConclusion[]
}

export interface ConclusionCasoPayload {
  casosId: number
  bienesSujetosPd: number[]
  sentencias: number[]
}
