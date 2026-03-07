import { Module } from '@nestjs/common';
import { GradoService } from './grado.service';
import { GradoController } from './grado.controller';

@Module({
  controllers: [GradoController],
  providers: [GradoService],
})
export class GradoModule {}
