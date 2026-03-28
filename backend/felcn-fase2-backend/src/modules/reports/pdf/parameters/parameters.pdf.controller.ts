import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ParametersPdfService } from './paramters.pdf.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports-pdf')
export class ParametersPdfController {
  constructor(
    private readonly pdfService: ParametersPdfService,
    @InjectRepository(Continente)
    private readonly continenteRepo: Repository<Continente>,
  ) {}

  @Get('parameters')
  async generarReporteParametros(@Res() res: Response) {
    const data = await this.continenteRepo.find();
    const pdfBuffer = await this.pdfService.generateParameterReport(data);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=reporte_parametros.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
