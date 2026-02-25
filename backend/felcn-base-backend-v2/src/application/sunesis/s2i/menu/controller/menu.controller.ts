import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { MenuService } from '../service/menu.service'

// TODO: Reactivar guards para producción

@ApiTags('Menús (S2I)')
@Controller('menus')
export class MenuController extends BaseController {
  constructor(private readonly menuService: MenuService) {
    super()
  }

  @ApiOperation({ summary: 'Listar menús con sus hijos' })
  @Get()
  async listarMenus() {
    const datos = await this.menuService.listarMenus()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener menú por ID' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const dato = await this.menuService.buscarPorId(parseInt(id))
    return this.successList(dato)
  }
}
