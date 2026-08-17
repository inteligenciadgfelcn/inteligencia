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
} from '@nestjs/common'
import { SituacionJuridicaService } from './situacion_juridica.service'
import { UpdateSituacionJuridicaDto } from './dto/update-situacion_juridica.dto'
import { CreateSituacionJuridicaDto } from './dto/create-situacion_juridica.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BaseController } from '@/common/base/base-controller'

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
  findAll() {
    return this.situacionJuridicaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.situacionJuridicaService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSituacionJuridicaDto: UpdateSituacionJuridicaDto
  ) {
    return this.situacionJuridicaService.update(+id, updateSituacionJuridicaDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.situacionJuridicaService.remove(+id)
  }
}
