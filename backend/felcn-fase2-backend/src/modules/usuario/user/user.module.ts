import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsuarioExternoService } from './user-externo.service';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:  [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UserService,  UsuarioExternoService],
  exports: [UserService],
})
export class UserModule {}
