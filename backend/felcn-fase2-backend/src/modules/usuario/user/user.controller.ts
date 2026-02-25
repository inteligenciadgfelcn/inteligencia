import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { UserService } from './user.service';
import { CreateUsuarioCompletoDto } from './dto/create-user-completo.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Users')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: CreateUsuarioCompletoDto, @Req() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    return this.usersService.create(dto, token);
  }

  // 🔹 LISTADO PAGINADO
  @Get()
  @ApiOperation({
    summary: 'Listado paginado de usuarios',
  })
  findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginationResult<User>> {
    return this.usersService.findAll(pagination);
  }

  // 🔹 LISTA SIMPLE
  @Get('lista')
  @ApiOperation({
    summary: 'Lista simple de usuarios activos',
  })
  findAllActivos(): Promise<User[]> {
    return this.usersService.findAllActivos();
  }

  // 🔹 BUSCAR POR ID
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // 🔹 ACTUALIZAR
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
  })
  @ApiParam({ name: 'id', example: 1 })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  // 🔹 ELIMINACIÓN LÓGICA
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario (lógico)',
  })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
