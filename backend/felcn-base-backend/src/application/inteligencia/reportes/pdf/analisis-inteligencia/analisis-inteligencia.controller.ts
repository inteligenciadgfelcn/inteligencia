import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AnalisisInteligenciaService } from './analisis-inteligencia.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Análisis Inteligencia')
@Controller('reportes/analisis-inteligencia')
export class AnalisisInteligenciaController {
  constructor(
    private readonly analisisInteligenciaService: AnalisisInteligenciaService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.analisisInteligenciaService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=analisis-inteligencia.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.analisisInteligenciaService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=analisis-inteligencia.xlsx',
    })
    res.send(buffer)
  }
}
