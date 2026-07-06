import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoCaracteristicasLgiController } from './catalogo-caracteristicas.controller'
import { CatalogoCaracteristicaLgiRepository } from './repository/catalogo-caracteristicas.repository'
import { CatalogoCaracteristicasLgiService } from './catalogo-caracteristicas.service'
import { CatalogoCaracteristicasLgi } from './entities/catalogo-caracteristica.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoCaracteristicasLgi], DB_LGI)],
  controllers: [CatalogoCaracteristicasLgiController],
  providers: [CatalogoCaracteristicasLgiService, CatalogoCaracteristicaLgiRepository],
  exports: [CatalogoCaracteristicasLgiService],
})
export class CatalogoCaracteristicasModule {}
