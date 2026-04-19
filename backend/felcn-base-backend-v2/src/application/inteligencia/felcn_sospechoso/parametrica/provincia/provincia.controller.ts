import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ProvinciaService } from './provincia.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger/dist'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Provincia')
@Controller('provincia')
export class ProvinciaController {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las provincias' })
  findAll() {
    return this.provinciaService.findAll()
  }

  @Get('departamento/:abrev')
  @ApiOperation({
    summary: 'Listar provincias por abreviatura de departamento',
  })
  findByAbrev(@Param('abrev') abrev: string) {
    return this.provinciaService.findByDepartamentoAbrev(abrev)
  }
}
