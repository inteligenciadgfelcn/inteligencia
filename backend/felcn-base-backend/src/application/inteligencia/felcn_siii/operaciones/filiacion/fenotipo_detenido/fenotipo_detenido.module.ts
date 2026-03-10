import { Module } from '@nestjs/common';
import { FenotipoDetenidoService } from './fenotipo_detenido.service';
import { FenotipoDetenidoController } from './fenotipo_detenido.controller';

@Module({
  controllers: [FenotipoDetenidoController],
  providers: [FenotipoDetenidoService],
})
export class FenotipoDetenidoModule {}
