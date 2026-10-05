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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import type { Request } from 'express'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { SituacionBienLgiService } from './situacion_bien_lgi.service'
import { CreateSituacionBienDto } from './dto/create-situacion-bien.dto'
import { UpdateSituacionBienLgiDto } from './dto/update-situacion_bien_lgi.dto'

type RequestConAuditoria = Request & {
  usuarioAuditoria?: string
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Ganancias ilícitas')
@Controller('situacion-bien-lgi')
export class SituacionBienLgiController {
  constructor(private readonly situacionBienService: SituacionBienLgiService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar la situación de un bien',
    description:
      'Para entrega a DIRCABI, enviar calbId "5". ' +
      'Institución y ubicación solo aplican para esa calidad.',
  })
  @ApiBody({
    type: CreateSituacionBienDto,
    examples: {
      custodio: {
        summary: 'Registro de custodio u otro',
        value: {
          itemBienSecId: '173',
          fiscalRequirente: 'Dra. María Pérez',
          calbId: '1',
          fechaEntrega: '2026-10-04T14:30:00',
          responsableRecepcion: 'Juan López',
          idTipoDocumento: 1,
          numeroDocumento: '1234567',
        },
      },
      entregaDircabi: {
        summary: 'Entrega a DIRCABI',
        value: {
          itemBienSecId: '150',
          fiscalRequirente: 'Dra. María Pérez',
          calbId: '5',
          fechaEntrega: '2026-10-04T14:30:00',
          responsableRecepcion: 'Ana García',
          institucion: 'DIRCABI La Paz',
          ubicacion: 'Depósito de DIRCABI, La Paz',
          idTipoDocumento: 1,
          numeroDocumento: '7654321',
        },
      },
    },
  })
  create(@Body() dto: CreateSituacionBienDto, @Req() req: RequestConAuditoria) {
    return this.situacionBienService.create(dto, req.usuarioAuditoria)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar las situaciones de bienes',
  })
  findAll() {
    return this.situacionBienService.findAll()
  }

  @Get('bien/:itemBienSecId')
  @ApiOperation({
    summary: 'Listar las situaciones de un bien',
  })
  @ApiParam({
    name: 'itemBienSecId',
    description: 'ID del bien secuestrado',
    type: String,
    example: '150',
  })
  findByBien(@Param('itemBienSecId') itemBienSecId: string) {
    return this.situacionBienService.findByBien(itemBienSecId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una situación de bien',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  findOne(@Param('id') id: string) {
    return this.situacionBienService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una situación de bien',
    description:
      'Si la calidad resultante es "5", permite guardar institución ' +
      'y ubicación. Para las demás calidades, el servicio limpia ambos campos.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  @ApiBody({
    type: UpdateSituacionBienLgiDto,
    examples: {
      entregaDircabi: {
        summary: 'Cambiar a entrega a DIRCABI',
        value: {
          calbId: '5',
          fechaEntrega: '2026-10-04T15:00:00',
          responsableRecepcion: 'Ana García',
          institucion: 'DIRCABI La Paz',
          ubicacion: 'Depósito de DIRCABI, La Paz',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateSituacionBienLgiDto) {
    return this.situacionBienService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una situación de bien',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '1',
  })
  remove(@Param('id') id: string) {
    return this.situacionBienService.remove(id)
  }
}
