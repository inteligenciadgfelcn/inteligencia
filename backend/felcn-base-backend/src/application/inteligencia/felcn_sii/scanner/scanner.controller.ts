import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ScannerGateway } from './scanner.gateway'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CapturarHuellaDto } from './dto/capturar.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Scanner - Huellas')
@Controller('scanner')
export class ScannerController {
  constructor(private gateway: ScannerGateway) {}

  @Post('capturar')
  @ApiOperation({ summary: 'Enviar solicitud de captura de huella al scanner' })
  capturar(@Body() dto: CapturarHuellaDto) {
    const scannerId = this.gateway.getScannerDisponible()

    if (!scannerId) {
      throw new Error('No hay scanners disponibles')
    }

    // ENVÍO DINÁMICO DESDE FRONTEND
    this.gateway.sendToScanner(scannerId, 'capture-fingerprint', {
      personaId: dto.personaId,
      dedo: dto.dedo,
    })

    return {
      ok: true,
      scannerId,
      mensaje: 'Captura enviada al scanner',
    }
  }
}
