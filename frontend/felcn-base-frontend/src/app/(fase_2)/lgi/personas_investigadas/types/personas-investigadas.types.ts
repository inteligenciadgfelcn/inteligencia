export interface SituacionJuridicaRow {
  situacionJuridicaId: number
  slId: number
  descripcion: string
  fecha: string
  estado?: boolean
  [key: string]: unknown
}
