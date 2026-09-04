import { Module } from '@nestjs/common';
import { FotoBienesService } from './foto_bienes.service';
import { FotoBienesController } from './foto_bienes.controller';

@Module({
  controllers: [FotoBienesController],
  providers: [FotoBienesService],
})
export class FotoBienesModule {}
