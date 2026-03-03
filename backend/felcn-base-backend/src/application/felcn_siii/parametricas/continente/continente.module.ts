import { Module } from '@nestjs/common';
import { ContinenteService } from './continente.service';
import { ContinenteController } from './continente.controller';

@Module({
  controllers: [ContinenteController],
  providers: [ContinenteService],
})
export class ContinenteModule {}
