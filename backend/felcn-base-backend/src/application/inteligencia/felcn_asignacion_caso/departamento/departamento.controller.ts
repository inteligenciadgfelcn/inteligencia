import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DepartamentoService } from './departamento.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Departamentos')
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
