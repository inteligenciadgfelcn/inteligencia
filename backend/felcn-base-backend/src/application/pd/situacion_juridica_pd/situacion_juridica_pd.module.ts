import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SituacionJuridicaPdController } from './situacion_juridica_pd.controller'
import { SituacionJuridicaPdService } from './situacion_juridica_pd.service'
import { SituacionJuridicaPdRepository } from './repository/situacion_juridica_pd.repository'
import { PerdidaDominioLgi } from './entities/perdida-dominio.entity'
import { MedidaCautelar } from '@/application/lgi/parametro/parametricas_lgi/entity/medida_cautelar.entity'
import { BieneSecuestradoLgi } from '@/application/lgi/bienes_secuestrados/entities/bienes_secuestrado.entity'
import { DB_LGI } from '@/core/config/database/database.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([PerdidaDominioLgi, MedidaCautelar, BieneSecuestradoLgi], DB_LGI),
  ],
  controllers: [SituacionJuridicaPdController],
  providers: [
    SituacionJuridicaPdService,
    SituacionJuridicaPdRepository,
  ],
  exports: [SituacionJuridicaPdService],
})
export class SituacionJuridicaPdModule {}