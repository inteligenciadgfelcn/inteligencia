import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { PersonasIdentificadasService } from './personas_identificadas.service'
import { CreatePersonasIdentificadaDto } from './dto/create-personas_identificada.dto'
import { UpdatePersonasIdentificadaDto } from './dto/update-personas_identificada.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeletePersonasIdentificadaDto } from './dto/delete-personas_identificada.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BaseController } from '@/common/base/base-controller'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('personas-afectadas')
export class PersonasIdentificadasController extends BaseController {

  constructor(
    private readonly personasIdentificadasService: PersonasIdentificadasService
  ) {
    super()
  }

  @Post('crear-persona-afectada')
  @ApiOperation({
    summary: 'Registrar una persona afectada',
  })
  registrarPersona(@Body() dto: CreatePersonasIdentificadaDto) {
    return this.personasIdentificadasService.registrarPersona(dto)
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Listar todas las personas afectadas en un caso con paginacion',
  })
  async findAll(
    @Param('casoId') casoId: string,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.personasIdentificadasService.findAll(
      +casoId,
      pagination
    )
    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una persona afectada',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.personasIdentificadasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona afectada',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: UpdatePersonasIdentificadaDto
  ) {
    return this.personasIdentificadasService.update(id, dto)
  }

  @Patch(':id/eliminar')
  @ApiOperation({
    summary: 'Eliminar lógicamente una persona afectada',
  })
  updateEstado(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: DeletePersonasIdentificadaDto
  ) {
    return this.personasIdentificadasService.eliminarLogicamente(id, dto)
  }
}
