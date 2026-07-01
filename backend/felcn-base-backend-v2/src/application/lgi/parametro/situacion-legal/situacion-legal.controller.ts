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
import { CreateSituacionLegalDto } from './dto/create-situacion-legal.dto'
import { UpdateSituacionLegalDto } from './dto/update-situacion-legal.dto'
import { SituacionLegalLgiService } from './situacion-legal.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Situacion Legal LGI')
@Controller('parametro/situacion-legal')
export class SituacionLegalLgiController {
  constructor(
    private readonly service: SituacionLegalLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateSituacionLegalDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSituacionLegalDto,
  ) {
    return this.service.update(id, dto)
  }

}