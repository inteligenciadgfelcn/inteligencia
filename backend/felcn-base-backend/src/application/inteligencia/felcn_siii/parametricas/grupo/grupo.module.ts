import { Module } from '@nestjs/common'
import { GrupoService } from './grupo.service'
import { GrupoController } from './grupo.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Grupo } from './entities/grupo.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { Distrital } from '../distrital/entities/distrital.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Distrital, Grupo], DB_SIII)],
  controllers: [GrupoController],
  providers: [GrupoService],
})
export class GrupoModule {}
