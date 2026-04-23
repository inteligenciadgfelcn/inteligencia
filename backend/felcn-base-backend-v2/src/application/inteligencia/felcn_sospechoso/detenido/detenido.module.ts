import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EstadoSospechoso } from '../parametrica/estado/entities/estadoSospechoso.entity'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { DetenidoSospechosoController } from './detenido.controller'
import { DetenidoSospechoso } from './entities/detenido-sospechoso.entity'
import { TipoDocumentoSospechoso } from './entities/tipo_documento-sospechoso.entity'
import { PaisSospechoso } from './entities/pais-sospechoso.entity'
import { DetenidoSospechosoService } from './detenido.service'
import { DetenidoSospechosoRepository } from './repository/detenido.repository'


@Module({
  imports: [
    TypeOrmModule.forFeature([DetenidoSospechoso, EstadoSospechoso, TipoDocumentoSospechoso, PaisSospechoso], DB_SOSPECHOSO),
  ],
  controllers: [DetenidoSospechosoController],
  providers: [DetenidoSospechosoService, DetenidoSospechosoRepository],
  exports: [DetenidoSospechosoService],
})
export class DetenidoSospechosoModule {}