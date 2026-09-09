import { Module } from '@nestjs/common'
import { CaracteristicasBienesService } from './caracteristicas_bienes.service'
import { CaracteristicasBienesController } from './caracteristicas_bienes.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BieneSecuestradoLgi } from '../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { DB_LGI } from '@/core/config/database/database.module'
import { CaracteristicasBienesRepository } from './repository/caracteristicas_bienes.repository'
import { CaracteristicasBiene } from './entities/caracteristicas_biene.entity'

@Module({
   imports: [
    TypeOrmModule.forFeature(
      [
        CaracteristicasBiene,
        BieneSecuestradoLgi,
      ],
      DB_LGI,
    ),
  ],

  controllers: [
    CaracteristicasBienesController,
  ],

  providers: [
    CaracteristicasBienesService,
    CaracteristicasBienesRepository,
  ],

  exports: [
    CaracteristicasBienesService,
    CaracteristicasBienesRepository,
  ],
})
export class CaracteristicasBienesModule {}
