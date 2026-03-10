import { Module } from '@nestjs/common';
import { FiliacionService } from './filiacion.service';
import { FiliacionController } from './filiacion.controller';

@Module({
  controllers: [FiliacionController],
  providers: [FiliacionService],
})
export class FiliacionModule {}
