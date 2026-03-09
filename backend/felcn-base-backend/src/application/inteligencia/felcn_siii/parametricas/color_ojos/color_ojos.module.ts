import { Module } from '@nestjs/common'
import { ColorOjosService } from './color_ojos.service'
import { ColorOjosController } from './color_ojos.controller'
import { ColorOjo } from './entities/color_ojo.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ColorOjo], DB_SIII)],
  controllers: [ColorOjosController],
  providers: [ColorOjosService],
})
export class ColorOjosModule {}
