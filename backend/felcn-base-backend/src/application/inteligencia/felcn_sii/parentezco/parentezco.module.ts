import { Module } from '@nestjs/common'
import { ParentezcoService } from './parentezco.service'
import { ParentezcoController } from './parentezco.controller'
import { Parentezco } from './entities/parentezco.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Parentezco], DB_SII)],
  controllers: [ParentezcoController],
  providers: [ParentezcoService],
  exports: [ParentezcoService],
})
export class ParentezcoModule {}
