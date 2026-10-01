import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateConclusionCasoDto } from './dto/create-conclusion_caso.dto'
import { UpdateConclusionCasoDto } from './dto/update-conclusion_caso.dto'
import { ConclusionCasoService } from './conclusion_caso.service'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

@ApiTags('Conclusión del caso LGI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@Controller('conclusion-caso')
export class ConclusionCasoController {
  constructor(private readonly service: ConclusionCasoService) {}

  @Post()
  @ApiOperation({
    summary: 'Guardar las selecciones de la conclusión del caso',
    description:
      'Sincroniza todos los ciclos, verbos rectores y tipologías enviados. ' +
      'Si ya existen selecciones para el caso, reemplaza sus selecciones activas.',
  })
  create(@Body() dto: CreateConclusionCasoDto) {
    return this.service.create(dto)
  }

  @Get(':casoId')
  @ApiOperation({
    summary: 'Consultar las selecciones activas de un caso',
  })
  @ApiParam({
    name: 'casoId',
    description: 'ID del caso',
    type: String,
    example: '60',
  })
  findByCaso(@Param('casoId') casoId: string) {
    return this.service.findByCaso(casoId)
  }

  @Patch(':casoId')
  @ApiOperation({
    summary: 'Actualizar las selecciones de un caso',
    description:
      'Modifica únicamente los grupos enviados. ' +
      'Un arreglo vacío da de baja todas las selecciones del grupo.',
  })
  @ApiParam({
    name: 'casoId',
    description: 'ID del caso',
    type: String,
    example: '60',
  })
  update(
    @Param('casoId') casoId: string,
    @Body() dto: UpdateConclusionCasoDto
  ) {
    return this.service.update(casoId, dto)
  }

  @Delete(':casoId/:tipo/:seleccionId')
  @ApiOperation({
    summary: 'Eliminar una selección de la conclusión del caso',
  })
  @ApiParam({
    name: 'casoId',
    description: 'ID del caso',
    type: String,
    example: '60',
  })
  @ApiParam({
    name: 'tipo',
    description: 'Catálogo de la selección que se eliminará',
    enum: ['ciclos', 'verbos-rectores', 'tipologias'],
    example: 'ciclos',
  })
  @ApiParam({
    name: 'seleccionId',
    description: 'ID del registro del catálogo',
    type: String,
    example: '7',
  })
  removeSeleccion(
    @Param('casoId') casoId: string,
    @Param('tipo') tipo: string,
    @Param('seleccionId') seleccionId: string
  ) {
    return this.service.removeSeleccion(casoId, tipo, seleccionId)
  }

  @Delete(':casoId')
  @ApiOperation({
    summary: 'Eliminar todas las selecciones de la conclusión del caso',
  })
  @ApiParam({
    name: 'casoId',
    description: 'ID del caso',
    type: String,
    example: '60',
  })
  remove(@Param('casoId') casoId: string) {
    return this.service.remove(casoId)
  }
}
