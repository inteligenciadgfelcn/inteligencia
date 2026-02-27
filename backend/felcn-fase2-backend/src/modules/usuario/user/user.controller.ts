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
  @ApiOperation({
    summary: 'Listado paginado de usuarios',
  })
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

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioCompletoDto,
    @Req() req,
  ): Promise<User> {
    const token = req.headers.authorization;

    return this.usersService.update(id, dto, token);
  }
}
