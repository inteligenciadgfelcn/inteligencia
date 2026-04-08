import { Module } from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { UsuarioController } from './usuario.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  DB_AUTH,
} from '@/core/config/database/database.module'
import { Usuario } from '@/core/usuario/entity/usuario.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario], DB_AUTH),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
