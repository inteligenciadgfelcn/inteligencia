import { Module } from '@nestjs/common'
import { PresedenciaLgiService } from './presedencia_lgi.service'
import { PresedenciaLgiController } from './presedencia_lgi.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresedenciaLgi } from './entities/presedencia_lgi.entity'
import { DB_LGI } from '@/core/config/database/database.module'
import { ConsultaSiiiRepository } from '../informacion_siii/repository/consulta.repository'
import { PresedenciaLgiRepository } from './repository/presedencia_lgi.repository'

@Module({
  imports: [TypeOrmModule.forFeature([PresedenciaLgi], DB_LGI)],
  controllers: [PresedenciaLgiController],
  providers: [PresedenciaLgiService, ConsultaSiiiRepository, PresedenciaLgiRepository],
})
export class PresedenciaLgiModule {}
