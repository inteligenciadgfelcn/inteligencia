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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { TipoSituacionLegalBienLgiService } from './tipo_situcion_bien.service'
import { UpdateTipoSituacionLegalBienDto } from './dto/update-tipo_situcion_bien.dto'
import { CreateTipoSituacionLegalBienDto } from './dto/create-tipo_situcion_bien.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Tipo Situación Legal Bien')
@Controller('parametro/tipo-situacion-legal-bien')
export class TipoSituacionLegalBienController {
  constructor(private readonly service: TipoSituacionLegalBienLgiService) {}

  @Post()
  create(@Body() dto: CreateTipoSituacionLegalBienDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoSituacionLegalBienDto
  ) {
    return this.service.update(id, dto)
  }
}
