import { Module } from '@nestjs/common'
import { ColorPielService } from './color_piel.service'
import { ColorPielController } from './color_piel.controller'
import { ColorPiel } from './entities/color_piel.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ColorPiel], DB_SII)],
  controllers: [ColorPielController],
  providers: [ColorPielService],
})
export class ColorPielModule {}
