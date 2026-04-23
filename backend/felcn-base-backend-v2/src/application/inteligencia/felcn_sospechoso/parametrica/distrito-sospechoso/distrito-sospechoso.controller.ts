import { Controller, Get, Param } from '@nestjs/common'
import { DistritoSospechosoService } from './distrito-sospechoso.service'
import { ApiOperation } from '@nestjs/swagger'

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
