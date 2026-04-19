import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DepartamentoService } from './departamento.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Departamentos')
@Controller('departamento')
export class DepartamentoController extends BaseController {
  constructor(private readonly departamentoService: DepartamentoService) {
    super()
  }
  @Get()
  @ApiOperation({ summary: 'Listar departamentos con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.departamentoService.findAll(pagination)
    return this.successListRows(result)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los departamentos (sin paginación)' })
  findAllGeneral() {
    return this.departamentoService.findAllGeneral()
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  findOne(@Param('id') id: number) {
    return this.departamentoService.findOne(id)
  }
}
