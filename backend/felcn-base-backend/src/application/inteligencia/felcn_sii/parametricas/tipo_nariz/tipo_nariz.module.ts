import { Module } from '@nestjs/common'
import { TipoNarizService } from './tipo_nariz.service'
import { TipoNarizController } from './tipo_nariz.controller'
import { TipoNariz } from './entities/tipo_nariz.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([TipoNariz], DB_SIII)],
  controllers: [TipoNarizController],
  providers: [TipoNarizService],
})
export class TipoNarizModule {}
