import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DetenidoSospechosoService } from './detenido.service'
import { CreateDetenidoDto } from './dto/create-detenido.dto'
import { UpdateDetenidoDto } from './dto/update-detenido.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Detenido')
@Controller('detenido')
export class DetenidoSospechosoController extends BaseController {
  constructor(private readonly detenidoService: DetenidoSospechosoService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registro de personas sospechosas',
  })
  create(@Body() createDetenidoDto: CreateDetenidoDto) {
    return this.detenidoService.create(createDetenidoDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listado de personas sospechosas',
  })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.detenidoService.findAllPaginado(pagination)
    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalle de una persona sospechosa',
  })
  findOne(@Param('id') id: string) {
    return this.detenidoService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualización de información de una persona sospechosa',
  })
  update(
    @Param('id') id: string,
    @Body() updateDetenidoDto: UpdateDetenidoDto
  ) {
    return this.detenidoService.update(+id, updateDetenidoDto)
  }
}
