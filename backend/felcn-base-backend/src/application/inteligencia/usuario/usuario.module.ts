import { Module } from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { UsuarioController } from './usuario.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  DB_AUTH,
} from '@/core/config/database/database.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([], DB_AUTH),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
