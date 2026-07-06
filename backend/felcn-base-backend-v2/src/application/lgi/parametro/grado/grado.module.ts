import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { GradoLgiController } from './grado.controller'
import { GradoLgiRepository } from './repository/grado.repository'
import { GradoLgiService } from './grado.service'
import { GradoLgi } from './entities/grado.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GradoLgi], DB_LGI)],
  controllers: [GradoLgiController],
  providers: [GradoLgiService, GradoLgiRepository],
  exports: [GradoLgiService],
})
export class GradoModule {}
