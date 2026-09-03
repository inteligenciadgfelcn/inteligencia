import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { TipoVinculoLgi } from './entities/tipo-vinculo.entity'
import { TipoVinculoLgiRepository } from './repository/tipo-vinculo.repository'
import { TipoVinculoLgiService } from './tipo-vinculo.service'
import { TipoVinculoLgiController } from './tipo-vinculo.controller'

@Module({
  imports: [TypeOrmModule.forFeature([TipoVinculoLgi], DB_LGI)],
  controllers: [TipoVinculoLgiController],
  providers: [TipoVinculoLgiService, TipoVinculoLgiRepository],
  exports: [TipoVinculoLgiService],
})
export class TipoVinculoModule {}
