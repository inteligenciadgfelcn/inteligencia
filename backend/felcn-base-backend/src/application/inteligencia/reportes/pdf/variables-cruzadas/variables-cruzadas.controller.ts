import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { VariablesCruzadasService } from './variables-cruzadas.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Variables Cruzadas')
@Controller('reportes/variables-cruzadas')
export class VariablesCruzadasController {
  constructor(
    private readonly variablesCruzadasService: VariablesCruzadasService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.variablesCruzadasService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=variables-cruzadas.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.variablesCruzadasService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=variables-cruzadas.xlsx',
    })
    res.send(buffer)
  }
}
