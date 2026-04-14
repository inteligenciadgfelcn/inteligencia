import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { TarjetaProntuarioService } from './tarjeta-prontuario.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte - Tarjeta Prontuario')
@Controller('reportes/tarjeta-prontuario')
export class TarjetaProntuarioController {
  constructor(
    private readonly tarjetaProntuarioService: TarjetaProntuarioService
  ) {}

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const buffer = await this.tarjetaProntuarioService.generarPDF()
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=tarjeta-prontuario.pdf',
    })
    res.send(buffer)
  }

  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.tarjetaProntuarioService.generarExcel()
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=tarjeta-prontuario.xlsx',
    })
    res.send(buffer)
  }
}
