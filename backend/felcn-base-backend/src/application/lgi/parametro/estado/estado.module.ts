import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { EstadoLgiController } from './estado.controller'
import { EstadoLgiRepository } from './repository/estado.repository'
import { EstadoLgiService } from './estado.service'
import { EstadoLgi } from './entities/estado.entity'

@Module({
  imports: [TypeOrmModule.forFeature([EstadoLgi], DB_LGI)],
  controllers: [EstadoLgiController],
  providers: [EstadoLgiService, EstadoLgiRepository],
  exports: [EstadoLgiService],
})
export class EstadoModule {}
