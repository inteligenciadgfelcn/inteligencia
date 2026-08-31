import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { LugarService } from '../service/lugar.service'
import { CreateLugarDto } from '../dto/create-lugar.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Lugares S2I (Flujo de Transporte)')
@Controller('s2i')
export class LugarController extends BaseController {
  constructor(private readonly service: LugarService) {
    super()
  }

  @ApiOperation({
    summary: 'Buscar lugares por coincidencia parcial de descripción',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Texto a buscar (mínimo 2 caracteres)',
  })
  @Get('lugares')
  async buscar(@Query('q') q?: string) {
    return this.successList(await this.service.buscar(q ?? ''))
  }

  @ApiOperation({
    summary:
      'Registrar un nuevo lugar (reutiliza uno existente si la descripción ya está registrada)',
  })
  @Post('lugares')
  async crear(@Body() dto: CreateLugarDto) {
    return this.successCreate(await this.service.crear(dto))
  }
}
