import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HuellaService } from '../../../felcn_sii/huella/huella.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ScannerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private scanners = new Map<
    string,
    { socketId: string; estado: string }
  >();

  private socketToScanner = new Map<string, string>();

  constructor(private readonly huellaService: HuellaService) {}

  /* =====================================================
     🔌 CONEXIÓN FRONTEND
  ===================================================== */
  handleConnection(client: Socket) {
    console.log('Cliente conectado:', client.id);

    // 🔥 ENVIAR ESTADO REAL (no por size)
    let estado = 'DESCONECTADO';

    for (const scanner of this.scanners.values()) {
      if (scanner.estado === 'DISPONIBLE') {
        estado = 'CONECTADO';
        break;
      }
    }

    client.emit('scanner-status', { estado });
  }

  /* =====================================================
     🔌 DESCONEXIÓN
  ===================================================== */
  handleDisconnect(client: Socket) {
    const scannerId = this.socketToScanner.get(client.id);

    if (scannerId) {
      this.scanners.delete(scannerId);
      this.socketToScanner.delete(client.id);

      console.log(`❌ Scanner ${scannerId} desconectado`);

      this.server.emit('scanner-status', {
        estado: 'DESCONECTADO',
        scannerId,
      });
    }
  }

  /* =====================================================
     🔥 REGISTRO SCANNER
  ===================================================== */
  @SubscribeMessage('register-scanner')
  handleRegister(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload;
    const { scannerId } = data;

    this.scanners.set(scannerId, {
      socketId: client.id,
      estado: 'DESCONECTADO', // 🔥 INICIA DESCONECTADO
    });

    this.socketToScanner.set(client.id, scannerId);

    console.log(`🆔 Scanner registrado: ${scannerId}`);
  }

  /* =====================================================
     💓 HEARTBEAT (CLAVE REAL)
  ===================================================== */
  @SubscribeMessage('scanner-ping')
  handlePing(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload;

    const { scannerId, conectado } = data;

    const scanner = this.scanners.get(scannerId);

    if (!scanner) return;

    // 🔥 ACTUALIZA ESTADO REAL
    scanner.estado = conectado ? 'DISPONIBLE' : 'DESCONECTADO';

    console.log(`💓 ${scannerId} → ${scanner.estado}`);

    // 🔥 AVISA AL FRONTEND
    this.server.emit('scanner-status', {
      estado: conectado ? 'CONECTADO' : 'DESCONECTADO',
      scannerId,
    });
  }

  /* =====================================================
     🔥 HUELLA PREVIEW
  ===================================================== */
  @SubscribeMessage('fingerprint-result')
  async handleFingerprint(client: Socket, payload: any) {
    const data = Array.isArray(payload) ? payload[0] : payload;

    console.log(data);
    

    this.server.emit('fingerprint-preview', {
      personaId: data.personaId,
      dedo: data.dedo,
      calidad: data.calidad,
      imagen: data.template,
    });
  }

  /* =====================================================
     🔥 DISPONIBLE
  ===================================================== */
  getScannerDisponible(): string | null {
    for (const [id, scanner] of this.scanners.entries()) {
      if (scanner.estado === 'DISPONIBLE') return id;
    }
    return null;
  }

  /* =====================================================
     🔥 ENVIAR AL SCANNER
  ===================================================== */
  sendToScanner(scannerId: string, event: string, data: any) {
    const scanner = this.scanners.get(scannerId);

    if (!scanner) throw new Error('Scanner no registrado');

    if (scanner.estado !== 'DISPONIBLE')
      throw new Error('Scanner no disponible');

    this.server.to(scanner.socketId).emit(event, data);
  }
}