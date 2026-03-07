import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { PruebaService } from './prueba.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ExportService } from '../export/export.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte prueba')
@Controller('prueba')
export class PruebaController {
  constructor(
    private readonly pruebaService: PruebaService,
    private readonly exportService: ExportService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const data = await this.pruebaService.GenerarPDF()
    const buffer = await this.exportService.generatePDF('prueba', data)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=prueba.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const data = await this.pruebaService.GenerarExcel()
    const buffer = await this.exportService.generateExcel('prueba', data)
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=prueba.xlsx',
    })
    res.send(buffer)
  }
}
