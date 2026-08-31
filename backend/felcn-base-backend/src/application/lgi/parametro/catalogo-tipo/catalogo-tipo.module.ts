import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { CatalogoTipoLgiController } from './catalogo-tipo.controller'
import { CatalogoTipoLgiRepository } from './repository/catalogo-tipo.repository'
import { CatalogoTipoLgiService } from './catalogo-tipo.service'
import { CatalogoTipoLgi } from './entities/catalogo-tipo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CatalogoTipoLgi], DB_LGI)],
  controllers: [CatalogoTipoLgiController],
  providers: [CatalogoTipoLgiService, CatalogoTipoLgiRepository],
  exports: [CatalogoTipoLgiService],
})
export class CatalogoTipoModule {}
