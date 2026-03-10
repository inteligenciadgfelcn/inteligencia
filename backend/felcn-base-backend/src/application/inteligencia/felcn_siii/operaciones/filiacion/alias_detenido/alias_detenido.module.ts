import { Module } from '@nestjs/common';
import { AliasDetenidoService } from './alias_detenido.service';
import { AliasDetenidoController } from './alias_detenido.controller';

@Module({
  controllers: [AliasDetenidoController],
  providers: [AliasDetenidoService],
})
export class AliasDetenidoModule {}
