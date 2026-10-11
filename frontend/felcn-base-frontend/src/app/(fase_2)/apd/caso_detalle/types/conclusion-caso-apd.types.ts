export interface SeleccionConclusion {
  id: string
  descripcion: string
}

export interface ConclusionCasoActual {
  casoId: string
  ciclos: SeleccionConclusion[]
  verbosRectores: SeleccionConclusion[]
  tipologias: SeleccionConclusion[]
}

export interface ConclusionCasoPayload {
  casoId: string
  cicloIds: string[]
  verboRectorIds: string[]
  tipologiaIds: string[]
}
