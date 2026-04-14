import { Module } from '@nestjs/common'
import { TipoCabelloService } from './tipo_cabello.service'
import { TipoCabelloController } from './tipo_cabello.controller'
import { TipoCabello } from './entities/tipo_cabello.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([TipoCabello], DB_SII)],
  controllers: [TipoCabelloController],
  providers: [TipoCabelloService],
})
export class TipoCabelloModule {}
