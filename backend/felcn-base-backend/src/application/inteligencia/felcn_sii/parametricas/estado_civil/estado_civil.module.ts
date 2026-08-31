import { Module } from '@nestjs/common'
import { EstadoCivilService } from './estado_civil.service'
import { EstadoCivilController } from './estado_civil.controller'
import { EstadoCivil } from './entities/estado_civil.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([EstadoCivil], DB_SII)],
  controllers: [EstadoCivilController],
  providers: [EstadoCivilService],
})
export class EstadoCivilModule {}
