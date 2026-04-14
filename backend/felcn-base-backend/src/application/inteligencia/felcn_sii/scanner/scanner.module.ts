import { Module } from '@nestjs/common'
import { ScannerGateway } from './scanner.gateway'
import { ScannerController } from './scanner.controller'
import { HuellaModule } from '@/application/inteligencia/felcn_sii/huella/huella.module'

@Module({
  imports: [HuellaModule],
  controllers: [ScannerController],
  providers: [ScannerGateway],
})
export class ScannerModule {}
