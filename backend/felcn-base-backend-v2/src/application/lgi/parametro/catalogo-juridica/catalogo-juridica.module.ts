import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoJuridicaLgiController } from './catalogo-juridica.controller'
import { CatalogoJuridicaLgiRepository } from './repository/catalogo-juridica.repository'
import { CatalogoJuridicaLgiService } from './catalogo-juridica.service'
import { CatalogoJuridicaLgi } from './entities/catalogo-juridica.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoJuridicaLgi], DB_LGI)],
  controllers: [CatalogoJuridicaLgiController],
  providers: [CatalogoJuridicaLgiService, CatalogoJuridicaLgiRepository],
  exports: [CatalogoJuridicaLgiService],
})
export class CatalogoJuridicaModule {}
