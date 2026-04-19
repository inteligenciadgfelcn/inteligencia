import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriaOperativoService } from './categoria_operativo.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Categoria Operativo')
@Controller('categoria-operativo')
export class CategoriaOperativoController {
  constructor(
    private readonly categoriaOperativoService: CategoriaOperativoService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorías de operativo' })
  findAll() {
    return this.categoriaOperativoService.findAll()
  }

 
}
