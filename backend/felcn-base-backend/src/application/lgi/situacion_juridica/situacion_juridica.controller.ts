import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common'
import { SituacionJuridicaService } from './situacion_juridica.service'
import { UpdateSituacionJuridicaDto } from './dto/update-situacion_juridica.dto'
import { CreateSituacionJuridicaDto } from './dto/create-situacion_juridica.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BaseController } from '@/common/base/base-controller'
import { DeleteSituacionJuridicaDto } from './dto/delete-situacion_juridica.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Situacion Jurídica')
@Controller('situacion-juridica')
export class SituacionJuridicaController extends BaseController {
  constructor(
    private readonly situacionJuridicaService: SituacionJuridicaService
  ) {
    super()
  }

  @Post('crear-situacion-juridica')
  @ApiOperation({
    summary: 'Registrar la situación jurídica de una persona implicada',
  })
  registrarSituacionJuridica(@Body() dto: CreateSituacionJuridicaDto) {
    return this.situacionJuridicaService.registrarSituacionJuridica(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar situaciones jurídicas',
  })
  findAll() {
    return this.situacionJuridicaService.findAll()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una situación jurídica',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.situacionJuridicaService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una situación jurídica',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateSituacionJuridicaDto
  ) {
    return this.situacionJuridicaService.update(id, dto)
  }
  
  @Patch(':id/eliminar')
  @ApiOperation({
    summary: 'Eliminar lógicamente una situación jurídica',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: DeleteSituacionJuridicaDto
  ) {
    return this.situacionJuridicaService.remove(id, dto)
  }
}
