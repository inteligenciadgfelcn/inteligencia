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
  ApiQuery,
} from '@nestjs/swagger';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { UserService } from './user.service';
import { CreateUsuarioCompletoDto } from './dto/create-user-completo.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { UpdateUsuarioCompletoDto } from './dto/update-user-completo.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Users')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUsuarioCompletoDto, @Req() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    return this.usersService.create(dto, token);
  }

  @Get()
  @ApiOperation({ summary: 'Listado paginado de usuarios' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginationResult<User>> {
    return this.usersService.findAll(pagination);
  }

  @Get('lista')
  @ApiOperation({
    summary: 'Lista simple de usuarios activos',
  })
  findAllActivos(): Promise<User[]> {
    return this.usersService.findAllActivos();
  }

  @Get('grupo/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por grupo',
  })
  findByGrupo(@Param('id') id: number): Promise<User[]> {
    return this.usersService.findByGrupo(id);
  }

  @Get('distrito/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por distrito',
  })
  findByDistrito(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return this.usersService.findByDistrito(id);
  }

  @Get('unidad/:id')
  @ApiOperation({
    summary: 'Lista de usuarios activos por unidad',
  })
  findByUnidad(@Param('id') id: number): Promise<User[]> {
    return this.usersService.findByUnidad(+id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizacion de datos de un usuario',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioCompletoDto,
    @Req() req,
  ): Promise<User> {
    const token = req.headers.authorization;

    return this.usersService.update(id, dto, token);
  }

  @Patch(':id/inactivacion')
  @ApiOperation({
    summary: 'Inactiva un usuario',
  })
  async inactivar(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const token = req.headers.authorization;
    return this.usersService.inactivarUsuario(id, token);
  }

  @Patch(':id/activacion')
  @ApiOperation({
    summary: 'Activar un usuario',
  })
  async activar(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const token = req.headers.authorization;
    return this.usersService.activarUsuario(id, token);
  }
}
