import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_S2I } from '../shared/constants'

// Entidades
import { Usuario } from './usuario/entity/usuario.entity'
import { ActivacionUsuario } from './usuario/entity/activacion-usuario.entity'
import { Rol } from './rol/entity/rol.entity'
import { Grado } from './estructura/entity/grado.entity'
import { Unidad } from './estructura/entity/unidad.entity'
import { Distrital } from './estructura/entity/distrital.entity'
import { Grupo } from './estructura/entity/grupo.entity'
import { ContenidoCaso } from './estructura/entity/contenido-caso.entity'
import { Menu } from './menu/entity/menu.entity'
import { MenuHijo } from './menu/entity/menu-hijo.entity'
import { Formulario } from './menu/entity/formulario.entity'
import { AuditoriaCambio } from './auditoria/entity/auditoria-cambio.entity'

// Controllers
import { UsuarioController } from './usuario/controller/usuario.controller'
import { EstructuraController } from './estructura/controller/estructura.controller'
import { MenuController } from './menu/controller/menu.controller'

// Services
import { UsuarioService } from './usuario/service/usuario.service'
import { UsuarioPerfilService } from './usuario/service/usuario-perfil.service'
import { EstructuraService } from './estructura/service/estructura.service'
import { MenuService } from './menu/service/menu.service'

// Repositories
import { UsuarioRepository } from './usuario/repository/usuario.repository'
import { EstructuraRepository } from './estructura/repository/estructura.repository'

const entities = [
  Usuario,
  ActivacionUsuario,
  Rol,
  Grado,
  Unidad,
  Distrital,
  Grupo,
  ContenidoCaso,
  Menu,
  MenuHijo,
  Formulario,
  AuditoriaCambio,
]

@Module({
  imports: [TypeOrmModule.forFeature(entities, DB_S2I)],
  controllers: [UsuarioController, EstructuraController, MenuController],
  providers: [
    UsuarioService,
    UsuarioPerfilService,
    EstructuraService,
    MenuService,
    UsuarioRepository,
    EstructuraRepository,
  ],
  exports: [UsuarioService, UsuarioPerfilService, EstructuraService, MenuService],
})
export class S2iModule {}
