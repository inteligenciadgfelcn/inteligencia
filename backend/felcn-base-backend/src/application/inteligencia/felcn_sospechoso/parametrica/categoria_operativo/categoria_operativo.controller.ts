import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriaOperativoService } from './categoria_operativo.service';
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

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
