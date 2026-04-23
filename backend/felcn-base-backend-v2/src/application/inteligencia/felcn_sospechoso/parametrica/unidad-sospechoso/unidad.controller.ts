import { Controller, Get, UseGuards } from '@nestjs/common';
import { UnidadSospechosoService } from './unidad.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Unidades')
@Controller('unidad')
export class UnidadSospechosoController {
  constructor(private readonly unidadService: UnidadSospechosoService) {}

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las unidades (sin paginación)' })
  findAllGeneral() {
    return this.unidadService.findAll()
  }
}
