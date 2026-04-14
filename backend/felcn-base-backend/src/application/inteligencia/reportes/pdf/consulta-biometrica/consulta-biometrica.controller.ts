import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ConsultaBiometricaService } from './consulta-biometrica.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Consulta Biométrica')
@Controller('reportes/consulta-biometrica')
export class ConsultaBiometricaController {
  constructor(
    private readonly consultaBiometricaService: ConsultaBiometricaService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.consultaBiometricaService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=consulta-biometrica.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.consultaBiometricaService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=consulta-biometrica.xlsx',
    })
    res.send(buffer)
  }
}
