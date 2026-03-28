import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsuarioExternoService } from './user-externo.service';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grado } from '../grados/entities/grado.entity';
import { Grupo } from '../grupos/entities/grupo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Grado, Grupo]), HttpModule],
  controllers: [UsersController],
  providers: [UserService, UsuarioExternoService],
  exports: [UserService],
})
export class UserModule {}
