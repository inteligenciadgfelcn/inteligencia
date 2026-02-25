import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParametersExcelService } from './continente.excel.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';


@Controller('reports-excel')
export class ParametersExcelController {
  constructor(
    private readonly excelService: ParametersExcelService,
    @InjectRepository(Continente)
    private readonly continenteRepo: Repository<Continente>,
  ) {}

  @Get('parameters')
  async generarReporteParametrosExcel(@Res() res: Response) {
    const data = await this.continenteRepo.find();
    const excelBuffer = await this.excelService.generateParameterReport(data);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=reporte_parametros.xlsx',
      'Content-Length': excelBuffer.length,
    });

    res.end(excelBuffer);
  }
}
