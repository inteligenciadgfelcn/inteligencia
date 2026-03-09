import { Module } from '@nestjs/common'
import { TipoOjosService } from './tipo_ojos.service'
import { TipoOjosController } from './tipo_ojos.controller'
import { TipoOjo } from './entities/tipo_ojo.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([TipoOjo], DB_SIII)],
  controllers: [TipoOjosController],
  providers: [TipoOjosService],
})
export class TipoOjosModule {}
