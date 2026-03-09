import { Module } from '@nestjs/common'
import { ConstitucionCorporal } from './entities/constitucion_corporal.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConstitucionCorporalService } from './constitucion_corporal.service'
import { ConstitucionCorporalController } from './constitucion_corporal.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ConstitucionCorporal], DB_SIII)],
  controllers: [ConstitucionCorporalController],
  providers: [ConstitucionCorporalService],
})
export class ConstitucionCorporalModule {}
