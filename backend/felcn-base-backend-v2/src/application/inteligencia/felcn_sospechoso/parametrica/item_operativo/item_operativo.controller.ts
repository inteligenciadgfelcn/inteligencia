import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ItemOperativoService } from './item_operativo.service'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Item Operativo')
@Controller('item-operativo')
export class ItemOperativoController {
  constructor(private readonly itemOperativoService: ItemOperativoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar items de operativo' })
  findAll() {
    return this.itemOperativoService.findAll()
  }

  @Get('categoria/:id')
  @ApiOperation({ summary: 'Listar items por categoría' })
  findByCategoria(@Param('id') id: number) {
    return this.itemOperativoService.findByCategoria(+id)
  }
}
