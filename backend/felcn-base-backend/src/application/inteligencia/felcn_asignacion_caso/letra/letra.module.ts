import { Module } from '@nestjs/common'
import { LetraService } from './letra.service'
import { LetraController } from './letra.controller'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Letra } from './entities/letra.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Letra], DB_SIII)],
  controllers: [LetraController],
  providers: [LetraService],
})
export class LetraModule {}
