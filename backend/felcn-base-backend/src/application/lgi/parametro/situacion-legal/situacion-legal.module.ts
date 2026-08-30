import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { SituacionLegalLgiController } from './situacion-legal.controller'
import { SituacionLegalLgiRepository } from './repository/situacion-legal.repository'
import { SituacionLegalLgiService } from './situacion-legal.service'
import { SituacionLegalLgi } from './entities/situacion-legal.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SituacionLegalLgi], DB_LGI)],
  controllers: [SituacionLegalLgiController],
  providers: [SituacionLegalLgiService, SituacionLegalLgiRepository],
  exports: [SituacionLegalLgiService],
})
export class SituacionLegalModule {}
