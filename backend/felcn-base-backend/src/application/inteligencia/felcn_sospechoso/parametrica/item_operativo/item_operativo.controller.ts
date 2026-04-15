import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ItemOperativoService } from './item_operativo.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

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
