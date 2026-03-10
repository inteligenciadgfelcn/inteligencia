import { Module } from '@nestjs/common';
import { DocumentoDetenidoService } from './documento_detenido.service';
import { DocumentoDetenidoController } from './documento_detenido.controller';

@Module({
  controllers: [DocumentoDetenidoController],
  providers: [DocumentoDetenidoService],
})
export class DocumentoDetenidoModule {}
