import { Module } from '@nestjs/common'

import { ScannerGateway } from './scanner.gateway'

import { ScannerController } from './scanner.controller'

import { HuellaModule } from '../huella/huella.module'

@Module({
  imports: [HuellaModule],

  controllers: [ScannerController],

  providers: [ScannerGateway],

  exports: [ScannerGateway],
})
export class ScannerModule {}
