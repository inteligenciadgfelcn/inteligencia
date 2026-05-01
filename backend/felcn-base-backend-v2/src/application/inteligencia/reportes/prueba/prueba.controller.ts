import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { PruebaService } from './prueba.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ExportService } from '../export/export.service'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte prueba')
@Controller('prueba')
export class PruebaController {
  constructor(
    private readonly pruebaService: PruebaService,
    private readonly exportService: ExportService
  ) {}

  @Get('export/pdf/:id')
  async exportPDF(@Param('id') id: number, @Res() res: Response) {
    const data = await this.pruebaService.GenerarPDF(+id)

    const buffer = await this.exportService.generatePDF('prueba', data)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=prueba-${id}.pdf`,
    })

    res.send(buffer)
  }

}
