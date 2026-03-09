import { Module } from '@nestjs/common'
import { ProfesionService } from './profesion.service'
import { ProfesionController } from './profesion.controller'
import { Profesion } from './entities/profesion.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Profesion], DB_SIII)],
  controllers: [ProfesionController],
  providers: [ProfesionService],
})
export class ProfesionModule {}
