import { Controller, Get, Query } from '@nestjs/common'
import { CasosParalelosService } from '../service/casos-paralelos.service'

@Controller('casos-paralelos')
export class CasosParalelosController {
  constructor(private readonly service: CasosParalelosService) { }

  /**
   * Endpoint para buscar casos por unidad y número de caso
   * GET /casos-paralelos/buscar?unidad=...&numeroCaso=...
   */
  @Get('buscar')
  async buscar(
    @Query('unidad') unidad: string,
    @Query('numeroCaso') numeroCaso: string
  ) {
    return this.service.buscarCasos(unidad, numeroCaso)
  }
}
