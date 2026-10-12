import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { Request } from 'express'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

import { SituacionJuridicaPdService } from './situacion_juridica_pd.service'
import { CreateSituacionJuridicaPdDto } from './dto/create-situacion_juridica_pd.dto'
import { UpdateSituacionJuridicaPdDto } from './dto/update-situacion_juridica_pd.dto'

type RequestConAuditoria = Request & {
  usuarioAuditoria?: string
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('situacion-bien-pd')
export class SituacionJuridicaPdController {
  constructor(private readonly service: SituacionJuridicaPdService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar la situación jurídica de un bien',
  })
  create(
    @Body() dto: CreateSituacionJuridicaPdDto,
    @Req() req: RequestConAuditoria
  ) {
    return this.service.create(dto, req.usuarioAuditoria)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar las situaciones jurídicas de bienes',
  })
  findAll() {
    return this.service.findAll()
  }

  @Get('bien/:itemBienSecId')
  @ApiOperation({
    summary: 'Listar las situaciones jurídicas de un bien',
  })
  @ApiParam({
    name: 'itemBienSecId',
    type: String,
    example: '4465',
  })
  findByBien(@Param('itemBienSecId') itemBienSecId: string) {
    return this.service.findByBien(itemBienSecId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una situación jurídica por ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una situación jurídica',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  update(@Param('id') id: string, @Body() dto: UpdateSituacionJuridicaPdDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una situación jurídica',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
