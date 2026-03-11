import { Module } from '@nestjs/common';
import { DocumentoDetenidoService } from './documento_detenido.service';
import { DocumentoDetenidoController } from './documento_detenido.controller';
import { DB_SIII } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoDetenido } from './entities/documento_detenido.entity';
import { TipoDocumento } from '../../../parametricas/tipo_documento/entities/tipo_documento.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([DocumentoDetenido, TipoDocumento], DB_SIII),
      ],
  controllers: [DocumentoDetenidoController],
  providers: [DocumentoDetenidoService],
})
export class DocumentoDetenidoModule {}
