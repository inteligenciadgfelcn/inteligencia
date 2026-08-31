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
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { PersonasImplicadasService } from './personas_implicadas.service'
import { UpdatePersonasImplicadaDto } from './dto/update-personas_implicada.dto'
import { BaseController } from '@/common/base/base-controller'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreatePersonaImplicadaDto } from './dto/create-personas_implicada.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DeletePersonasImplicadaDto } from './dto/delete-personas_implicadas.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Personas implicadas')
@Controller('personas-implicadas')
export class PersonasImplicadasController extends BaseController {
  constructor(
    private readonly personasImplicadasService: PersonasImplicadasService
  ) {
    super()
  }

  @Post('crear-persona-implicada')
  @ApiOperation({
    summary: 'Registrar una persona implicada',
  })
  registrarPersona(@Body() dto: CreatePersonaImplicadaDto) {
    return this.personasImplicadasService.registrarPersona(dto)
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Listar todas las personas implicadas en un caso con paginacion',
  })
  async findAll(
    @Param('casoId') casoId: string,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.personasImplicadasService.findAll(
      +casoId,
      pagination
    )
    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una persona implicada con sus situaciones jurídicas',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.personasImplicadasService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona implicada',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: UpdatePersonasImplicadaDto
  ) {
    return this.personasImplicadasService.update(id, dto)
  }

  @Patch(':id/eliminar')
  @ApiOperation({
    summary: 'Eliminar lógicamente una persona implicada',
  })
  updateEstado(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: DeletePersonasImplicadaDto
  ) {
    return this.personasImplicadasService.eliminarLogicamente(id, dto)
  }
}
