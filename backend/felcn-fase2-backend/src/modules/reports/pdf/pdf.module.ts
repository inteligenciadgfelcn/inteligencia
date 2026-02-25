import { Module } from '@nestjs/common';
import { ParametersPdfService } from './parameters/paramters.pdf.service';
import { ParametersPdfController } from './parameters/parameters.pdf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Continente])],
  providers: [ParametersPdfService],
  controllers: [ParametersPdfController],
})
export class PdfModule {}
