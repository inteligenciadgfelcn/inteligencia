import { Module } from '@nestjs/common';
import { ParametersExcelService } from './continente/continente.excel.service';
import { ParametersExcelController } from './continente/continente.excel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Continente])],
  providers: [ParametersExcelService],
  controllers: [ParametersExcelController],
})
export class ExcelModule {}
