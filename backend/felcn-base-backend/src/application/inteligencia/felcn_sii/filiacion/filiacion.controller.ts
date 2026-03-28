import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { FiliacionService } from './filiacion.service'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Filiacion')
@Controller('filiacion')
export class FiliacionController extends BaseController {
  constructor(private readonly filiacionService: FiliacionService) {
    super()
  }

  @Get('personas/:caso/:filiado')
  @ApiOperation({ summary: 'Listar personas para filiación' })
  @ApiParam({
    name: 'caso',
    example: 'BN-C-1/26',
    description: 'Número de caso',
  })
  @ApiParam({
    name: 'filiado',
    example: 1,
    description: 'Estado de filiación: 1 = Filiado, 0 = No Filiado',
  })
  async obtenerPersonas(
    @Param('caso') caso: string,
    @Param('filiado', ParseIntPipe) filiado: number,
    @Query() pagination: PaginacionQueryDto
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
