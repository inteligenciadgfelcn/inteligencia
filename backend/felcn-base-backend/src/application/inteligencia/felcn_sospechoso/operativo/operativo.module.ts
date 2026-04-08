import { Module } from '@nestjs/common';
import { OperativoService } from './operativo.service';
import { OperativoController } from './operativo.controller';

@Module({
  controllers: [OperativoController],
  providers: [OperativoService],
})
export class OperativoModule {}
