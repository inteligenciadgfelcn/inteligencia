import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoClaseLgiController } from './catalogo-clase.controller'
import { CatalogoClaseLgiRepository } from './repository/catalogo-clase.repository'
import { CatalogoClaseLgiService } from './catalogo-clase.service'
import { CatalogoClaseLgi } from './entities/catalogo-clase.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoClaseLgi], DB_LGI)],
  controllers: [CatalogoClaseLgiController],
  providers: [CatalogoClaseLgiService, CatalogoClaseLgiRepository],
  exports: [CatalogoClaseLgiService],
})
export class CatalogoClaseModule {}
