import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { EtapaLgiController } from './etapa.controller'
import { EtapaLgiRepository } from './repository/etapa.repository'
import { EtapaLgiService } from './etapa.service'
import { EtapaLgi } from './entities/etapa.entity'

@Module({
  imports: [TypeOrmModule.forFeature([EtapaLgi], DB_LGI)],
  controllers: [EtapaLgiController],
  providers: [EtapaLgiService, EtapaLgiRepository],
  exports: [EtapaLgiService],
})
export class EtapaModule {}
