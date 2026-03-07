import { Module } from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { UsuarioController } from './usuario.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './entities/usuario.entity'
import { Distrital } from '../distrital/entities/distrital.entity'
import { Grupo } from '../grupo/entities/grupo.entity'
import { Unidad } from '../unidad/entities/unidad.entity'
import { DB_SIII } from '@/core/config/database/database.module'

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Distrital,Grupo, Unidad], DB_SIII)],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
