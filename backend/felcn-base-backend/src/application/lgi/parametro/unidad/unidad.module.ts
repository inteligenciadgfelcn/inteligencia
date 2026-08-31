import { Module } from '@nestjs/common'
import { UnidadLgiService } from './unidad.service'
import { UnidadLgiController } from './unidad.controller'
import { UnidadLgi } from './entities/unidad.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { UnidadLgiRepository } from './repository/unidad.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UnidadLgi], DB_LGI)],
  controllers: [UnidadLgiController],
  providers: [UnidadLgiService,UnidadLgiRepository],
  exports: [UnidadLgiService],
})
export class UnidadModule {}
