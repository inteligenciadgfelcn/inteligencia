import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { CreateTamanoDocDto } from './dto/create-tamano-doc.dto'
import { UpdateTamanoDocDto } from './dto/update-tamano-doc.dto'
import { TamanoDocLgiService } from './tamano-doc.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Tamano Doc LGI')
@Controller('parametro/tamano-doc')
export class TamanoDocLgiController {
  constructor(
    private readonly unidadService: TamanoDocLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateTamanoDocDto) {
    return this.unidadService.create(dto)
  }

  @Get()
  findAll() {
    return this.unidadService.findAll()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.unidadService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTamanoDocDto,
  ) {
    return this.unidadService.update(id, dto)
  }

}