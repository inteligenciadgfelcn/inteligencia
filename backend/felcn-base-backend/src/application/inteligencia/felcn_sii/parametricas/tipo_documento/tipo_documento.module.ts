import { Module } from '@nestjs/common'
import { TipoDocumentoService } from './tipo_documento.service'
import { TipoDocumentoController } from './tipo_documento.controller'
import { TipoDocumento } from './entities/tipo_documento.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([TipoDocumento], DB_SII)],
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService],
})
export class TipoDocumentoModule {}
