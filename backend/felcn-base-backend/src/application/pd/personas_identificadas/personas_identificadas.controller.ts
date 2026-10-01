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
import { PaginacionQueryDto } from '@/common/dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeletePersonasIdentificadaDto } from './dto/delete-personas_identificada.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('personas-identificadas')
export class PersonasIdentificadasController {
  [x: string]: any
  constructor(
    private readonly personasIdentificadasService: PersonasIdentificadasService
  ) {}

  @Post('crear-persona-identificada')
  @ApiOperation({
    summary: 'Registrar una persona identificada',
  })
  registrarPersona(@Body() dto: CreatePersonasIdentificadaDto) {
    return this.personasIdentificadasService.registrarPersona(dto)
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Listar todas las personas identificadas en un caso con paginacion',
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
    summary: 'Obtener una persona identificada con sus situaciones jurídicas',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.personasIdentificadasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona identificada',
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
    summary: 'Eliminar lógicamente una persona identificada',
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
