export interface ResultadoEnvio {
  messageId: string
  exito: boolean
  error?: string
}

export interface OtpDeliveryChannel {
  enviar(destino: string, codigo: string, idUsuario?: string): Promise<ResultadoEnvio>
  nombre(): string
}
