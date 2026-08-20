export interface RespuestaSinarap {
  codigo: number
  descripcion: string
  uuid: string
}

export const respuestaFakeSinarap = (): RespuestaSinarap => ({
  codigo: 200,
  descripcion:
    'Registro recibido correctamente por SINARAP (entorno de desarrollo, respuesta simulada).',
  uuid: '27030161-28ba-4917-8301-6128bac9178e',
})
