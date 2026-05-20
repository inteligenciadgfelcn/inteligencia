import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'
import { InternalController } from './internal.controller'
import { InternalService } from './internal.service'

@Module({
  imports: [TypeOrmModule.forFeature([CiudadaniaUsuario])],
  controllers: [InternalController],
  providers: [InternalService],
})
export class InternalModule {}
