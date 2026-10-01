import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CreatePersonasImplicadasPdDto } from './dto/create-personas_implicadas_pd.dto'
import { UpdatePersonasImplicadasPdDto } from './dto/update-personas_implicadas_pd.dto'
import { PersonasImplicadasPdService } from './personas_implicadas_pd.service'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { DeletePersonasImplicadaPdDto } from './dto/delete-personas_implicadas.dto'
import { BaseController } from '@/common/base'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Perdida de Dominio')
@Controller('personas-implicadas-pd')
export class PersonasImplicadasPdController extends BaseController {
  constructor(private readonly personasImplicadasPdService: PersonasImplicadasPdService) {
    super()
  }

  @Post('crear-persona-implicada')
  @ApiOperation({
    summary: 'Registrar una persona implicada',
  })
  registrarPersona(@Body() dto: CreatePersonasImplicadasPdDto) {
    return this.personasImplicadasPdService.registrarPersona(dto)
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Listar todas las personas implicadas en un caso con paginacion',
  })
  async findAll(
    @Param('casoId') casoId: string,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.personasImplicadasPdService.findAll(
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
    return this.personasImplicadasPdService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una persona implicada',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: UpdatePersonasImplicadasPdDto
  ) {
    return this.personasImplicadasPdService.update(id, dto)
  }

  @Patch(':id/eliminar')
  @ApiOperation({
    summary: 'Eliminar lógicamente una persona implicada',
  })
  updateEstado(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    dto: DeletePersonasImplicadaPdDto
  ) {
    return this.personasImplicadasPdService.eliminarLogicamente(id, dto)
  }
}
