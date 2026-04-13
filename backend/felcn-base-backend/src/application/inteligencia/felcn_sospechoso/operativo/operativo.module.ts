import { Module } from '@nestjs/common';
import { OperativoService } from './operativo.service';
import { OperativoController } from './operativo.controller';
import { SiiiRepository } from './repositories/siii.repository';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  controllers: [OperativoController],
  providers: [OperativoService, SiiiRepository, AuthRepository],
   exports: [OperativoService],
})
export class OperativoModule {}
