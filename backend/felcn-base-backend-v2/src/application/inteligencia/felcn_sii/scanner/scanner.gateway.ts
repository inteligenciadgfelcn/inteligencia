import { HuellaService } from '@/application/inteligencia/felcn_sii/huella/huella.service'

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  path: '/socket.io',

  cors: {
    origin: '*',
    credentials: true,
  },

  transports: ['websocket', 'polling'],
})


export class ScannerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  /*
   MULTI SCANNER
  */
  private scanners = new Map<
    string,
    {
      socketId: string
      estado: string
      lastPing: number
    }
  >()

  /*
   socket → scanner
  */
  private socketToScanner = new Map<string, string>()

  constructor(private readonly huellaService: HuellaService) {}

  /*
   FRONTEND
  */
  handleConnection(client: Socket) {
    console.log(`🟢 Cliente conectado: ${client.id}`)

    client.emit('scanner-list', {
      scanners: this.getScanners(),
    })
  }

  /*
   DESCONECTAR
  */
  async handleDisconnect(client: Socket) {
    const scannerId = this.socketToScanner.get(client.id)

    if (!scannerId) return

    this.scanners.delete(scannerId)

    this.socketToScanner.delete(client.id)

    console.log(`❌ Scanner desconectado: ${scannerId}`)

    this.broadcastScanners()
  }

  /*
   REGISTER
  */
  @SubscribeMessage('register-scanner')
  async handleRegister(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload

    const { scannerId } = data

    if (!scannerId) return

    /*
     RAM
    */
    this.scanners.set(scannerId, {
      socketId: client.id,

      estado: 'DISPONIBLE',

      lastPing: Date.now(),
    })

    this.socketToScanner.set(client.id, scannerId)

    /*
     EXTRAER
    */
    const hostname = data.hostname ?? 'UNKNOWN'

    const serial = data.serial ?? 'UNKNOWN'

    console.log(`🆔 Scanner registrado: ${scannerId}`)

    console.log(this.getScanners())

    this.broadcastScanners()
  }

  /*
   HEARTBEAT
  */
  // @SubscribeMessage('scanner-ping')
  // async handlePing(client: Socket, payload: any) {
  //   const data = Array.isArray(payload) ? payload[0] : payload

  //   const { scannerId, conectado } = data

  //   const scanner = this.scanners.get(scannerId)

  //   if (!scanner) return

  //   /*
  //    RAM
  //   */
  //   scanner.estado = conectado ? 'DISPONIBLE' : 'DESCONECTADO'

  //   scanner.lastPing = Date.now()

  //   console.log(`💓 ${scannerId} → ${scanner.estado}`)

  //   this.broadcastScanners()
  // }

  /*
   RESULTADO
  */
  @SubscribeMessage('fingerprint-result')
  async handleFingerprint(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload

    console.log('🟢 HUELLA RECIBIDA')

    console.log(data)

    /*
     FRONTEND
    */
    this.server.emit('fingerprint-preview', {
      scannerId: data.scannerId,

      personaId: data.personaId,

      dedo: data.dedo,

      calidad: data.calidad,

      imagen: data.template,
    })
  }

  /*
   ERROR
  */
  @SubscribeMessage('fingerprint-error')
  handleFingerprintError(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload

    console.log('❌ ERROR HUELLA')

    console.log(data)

    this.server.emit('fingerprint-error', data)
  }

  /*
   LISTA
  */
  getScanners() {
    return Array.from(this.scanners.entries()).map(([id, scanner]) => ({
      scannerId: id,

      estado: scanner.estado,

      lastPing: scanner.lastPing,
    }))
  }

  /*
   DISPONIBLES
  */
  getScannersDisponibles() {
    return this.getScanners().filter((x) => x.estado === 'DISPONIBLE')
  }

  /*
   UNO
  */
  getScanner(scannerId: string) {
    return this.scanners.get(scannerId)
  }

  /*
   ENVIAR
  */
  sendToScanner(scannerId: string, event: string, data: any) {
    const scanner = this.scanners.get(scannerId)

    if (!scanner) {
      throw new Error('Scanner no registrado')
    }

    if (scanner.estado !== 'DISPONIBLE') {
      throw new Error('Scanner no disponible')
    }

    console.log(`📤 Enviando a ${scannerId}`)

    this.server.to(scanner.socketId).emit(event, data)
  }

  /*
   BROADCAST
  */
  private broadcastScanners() {
    this.server.emit('scanner-list', {
      scanners: this.getScanners(),
    })
  }
}
