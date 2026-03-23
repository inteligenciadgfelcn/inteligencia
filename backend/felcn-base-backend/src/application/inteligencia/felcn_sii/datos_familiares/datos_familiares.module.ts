import { Module } from '@nestjs/common';
import { DatosFamiliaresService } from './datos_familiares.service';
import { DatosFamiliaresController } from './datos_familiares.controller';

@Module({
  controllers: [DatosFamiliaresController],
  providers: [DatosFamiliaresService],
})
export class DatosFamiliaresModule {}
