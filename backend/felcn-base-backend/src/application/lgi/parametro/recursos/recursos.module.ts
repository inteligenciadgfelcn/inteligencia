import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { RecursosLgiController } from './recursos.controller'
import { RecursosLgiRepository } from './repository/recursos.repository'
import { RecursosLgiService } from './recursos.service'
import { RecursosLgi } from './entities/recursos.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RecursosLgi], DB_LGI)],
  controllers: [RecursosLgiController],
  providers: [RecursosLgiService, RecursosLgiRepository],
  exports: [RecursosLgiService],
})
export class RecursosModule {}
