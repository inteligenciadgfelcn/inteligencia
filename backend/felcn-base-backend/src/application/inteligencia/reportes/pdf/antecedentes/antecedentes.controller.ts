import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AntecedentesService } from './antecedentes.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Antecedentes')
@Controller('reportes/antecedentes')
export class AntecedentesController {
  constructor(private readonly antecedentesService: AntecedentesService) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.antecedentesService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=antecedentes.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.antecedentesService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=antecedentes.xlsx',
    })
    res.send(buffer)
  }
}
