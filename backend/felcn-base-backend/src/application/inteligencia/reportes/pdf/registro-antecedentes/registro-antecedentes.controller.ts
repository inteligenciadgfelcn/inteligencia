import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RegistroAntecedentesService } from './registro-antecedentes.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Registro Antecedentes')
@Controller('reportes/registro-antecedentes')
export class RegistroAntecedentesController {
  constructor(
    private readonly registroAntecedentesService: RegistroAntecedentesService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.registroAntecedentesService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=registro-antecedentes.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.registroAntecedentesService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=registro-antecedentes.xlsx',
    })
    res.send(buffer)
  }
}
