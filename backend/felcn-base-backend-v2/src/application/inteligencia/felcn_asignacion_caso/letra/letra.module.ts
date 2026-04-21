import { Module } from '@nestjs/common'
import { LetraService } from './letra.service'
import { LetraController } from './letra.controller'
import { DB_ASIG_CASOS} from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Letra } from './entities/letra.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Letra], DB_ASIG_CASOS)],
  controllers: [LetraController],
  providers: [LetraService],
})
export class LetraModule {}
