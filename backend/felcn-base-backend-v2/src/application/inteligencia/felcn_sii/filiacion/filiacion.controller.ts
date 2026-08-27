import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common'
import { FiliacionService } from './filiacion.service'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

@ApiBearerAuth()
@UseInterceptors(AuditoriaUsuarioInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Filiacion')
@Controller('filiacion')
export class FiliacionController extends BaseController {
  constructor(private readonly filiacionService: FiliacionService) {
    super()
  }

  @Get('personas')
  @ApiOperation({
    summary: 'Listar personas para filiación',
  })
  @ApiQuery({
    name: 'caso',
    example: 'LP-ADM-14/26',
    description: 'Número de caso',
  })
  @ApiQuery({
    name: 'filiado',
    example: 1,
    description: 'Estado de filiación: 1 = Filiado, 0 = No Filiado',
  })
  @ApiQuery({
    name: 'pagina',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limite',
    example: 10,
    required: false,
  })
  async obtenerPersonas(
    @Query('caso')
    caso: string,

    @Query('filiado', ParseIntPipe)
    filiado: number,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.filiacionService.obtenerPersonasPorCaso(
      caso,
      filiado,
      pagination
    )

    return this.successListRows(result)
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar formulario de Filiación de personas',
  })
  create(@Body() createFiliacionDto: CreateFiliacionDto) {
    return this.filiacionService.create(createFiliacionDto)
  }

  @Get('persona/:id')
  @ApiOperation({ summary: 'Obtener información de una persona auxiliar' })
  @ApiParam({
    name: 'id',
    example: 421,
    description: 'ID de la persona auxiliar',
  })
  async obtenerPersona(@Param('id', ParseIntPipe) id: number) {
    return await this.filiacionService.obtenerPersona(id)
  }

  @Get('detenido/:id')
  @ApiOperation({ summary: 'Obtener información de un detenido' })
  @ApiParam({
    name: 'id',
    example: 154569,
    description: 'ID del detenido',
  })
  async obtenerDetenido(@Param('id', ParseIntPipe) id: number) {
    return await this.filiacionService.obtenerDetenido(id)
  }
}
