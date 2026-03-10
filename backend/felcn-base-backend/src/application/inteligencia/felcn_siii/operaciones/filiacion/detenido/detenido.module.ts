import { Module } from '@nestjs/common';
import { DetenidoService } from './detenido.service';
import { DetenidoController } from './detenido.controller';

@Module({
  controllers: [DetenidoController],
  providers: [DetenidoService],
})
export class DetenidoModule {}
