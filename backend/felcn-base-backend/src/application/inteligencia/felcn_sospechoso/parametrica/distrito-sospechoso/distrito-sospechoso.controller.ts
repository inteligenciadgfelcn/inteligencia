import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { DistritoSospechosoService } from './distrito-sospechoso.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - distritos')
@Controller('distrito')
export class DistritoSospechosoController {
  constructor(
    private readonly distritoSospechosoService: DistritoSospechosoService
  ) {}
  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las distritos (sin paginación)' })
  findAllGeneral() {
    return this.distritoSospechosoService.findAll()
  }

  @Get('unidad/:idUnidad')
  findByUnidad(@Param('idUnidad') idUnidad: number) {
    return this.distritoSospechosoService.findByUnidad(+idUnidad)
  }
}
