import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ParentezcoService } from './parentezco.service'
import { CreateParentezcoDto } from './dto/create-parentezco.dto'
import { UpdateParentezcoDto } from './dto/update-parentezco.dto'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Parentezco')
@Controller('parentezco')
export class ParentezcoController extends BaseController {
  constructor(private readonly parentezcoService: ParentezcoService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un parentezco' })
  @ApiResponse({ status: 201, description: 'Parentezco creado correctamente' })
  create(@Body() dto: CreateParentezcoDto) {
    return this.parentezcoService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los parentezco (sin paginación)' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.parentezcoService.findAll(pagination)
    return this.successListRows(result)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los parentezco (sin paginación)' })
  findAllGeneral() {
    return this.parentezcoService.findAllGeneral()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Parentezco por ID' })
  findOne(@Param('id') id: number) {
    return this.parentezcoService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un parentezco' })
  update(@Param('id') id: number, @Body() dto: UpdateParentezcoDto) {
    return this.parentezcoService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un Parentezco (borrado lógico)' })
  remove(@Param('id') id: number) {
    return this.parentezcoService.remove(id)
  }
}
