import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Huella } from './entities/huella.entity'
import { HuellaService } from './huella.service'
import { HuellaController } from './huella.controller'
import { DB_SII } from '@/core/config/database/database.module'

@Module({
  imports: [TypeOrmModule.forFeature([Huella], DB_SII)],
  controllers: [HuellaController],
  providers: [HuellaService],
  exports: [HuellaService],
})
export class HuellaModule {}
