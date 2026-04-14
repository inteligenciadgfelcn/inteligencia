import { Module } from '@nestjs/common'
import { ColorCabelloService } from './color_cabello.service'
import { ColorCabelloController } from './color_cabello.controller'
import { ColorCabello } from './entities/color_cabello.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ColorCabello], DB_SII)],
  controllers: [ColorCabelloController],
  providers: [ColorCabelloService],
})
export class ColorCabelloModule {}
