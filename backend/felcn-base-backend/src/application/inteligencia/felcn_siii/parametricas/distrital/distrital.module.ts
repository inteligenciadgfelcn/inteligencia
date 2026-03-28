import { Module } from '@nestjs/common'
import { DistritalService } from './distrital.service'
import { DistritalController } from './distrital.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Distrital } from './entities/distrital.entity'
import { Unidad } from '../unidad/entities/unidad.entity'
import { DB_SIII } from '@/core/config/database/database.module'

@Module({
  imports: [TypeOrmModule.forFeature([Distrital, Unidad], DB_SIII)],
  controllers: [DistritalController],
  providers: [DistritalService],
  exports: [TypeOrmModule],
})
export class DistritalModule {}
