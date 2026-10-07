import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { ConclusionPdService } from './conclusion_caso.service'
import { CreateConclusionPdDto } from './dto/create-conclusion_caso.dto'
import { UpdateConclusionPdDto } from './dto/update-conclusion_caso.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'


type RequestUsuario = Request & {
  user: {
    numeroPase: string
  }
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('conclusion-pd')
export class ConclusionPdController {
  constructor(
    private readonly service: ConclusionPdService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Guardar las selecciones de la conclusión del caso',
  })
  create(
    @Body() dto: CreateConclusionPdDto,
    @Req() request: RequestUsuario
  ) {
    return this.service.create(
      dto,
      request.user.numeroPase
    )
  }

  @Get(':casosId')
  @ApiOperation({
    summary: 'Consultar la conclusión por caso',
  })
  @ApiParam({
    name: 'casosId',
    type: Number,
    example: 191,
  })
  findByCaso(
    @Param('casosId', ParseIntPipe) casosId: number
  ) {
    return this.service.findByCaso(casosId)
  }

  @Patch(':casosId')
  @ApiOperation({
    summary: 'Actualizar las selecciones de la conclusión',
  })
  @ApiParam({
    name: 'casosId',
    type: Number,
    example: 191,
  })
  update(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Body() dto: UpdateConclusionPdDto,
    @Req() request: RequestUsuario
  ) {
    return this.service.update(
      casosId,
      dto,
      request.user.numeroPase
    )
  }

  @Delete(':casosId/:tipo/:seleccionId')
  @ApiOperation({
    summary: 'Eliminar una selección del caso',
  })
  @ApiParam({
    name: 'casosId',
    type: Number,
    example: 191,
  })
  @ApiParam({
    name: 'tipo',
    enum: ['bienes-sujetos-pd', 'sentencias'],
  })
  @ApiParam({
    name: 'seleccionId',
    type: Number,
    example: 1,
    description: 'Identificador del catálogo seleccionado',
  })
  removeSeleccion(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Param('tipo') tipo: string,
    @Param('seleccionId', ParseIntPipe) seleccionId: number
  ) {
    return this.service.removeSeleccion(
      casosId,
      tipo,
      seleccionId
    )
  }

  @Delete(':casosId')
  @ApiOperation({
    summary: 'Eliminar todas las selecciones de la conclusión',
  })
  @ApiParam({
    name: 'casosId',
    type: Number,
    example: 191,
  })
  remove(
    @Param('casosId', ParseIntPipe) casosId: number
  ) {
    return this.service.remove(casosId)
  }
}