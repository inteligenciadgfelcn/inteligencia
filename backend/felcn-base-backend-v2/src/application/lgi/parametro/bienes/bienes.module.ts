import { Module } from '@nestjs/common';
import { BienesService } from './bienes.service';
import { BienesController } from './bienes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BienesLgi } from './entities/biene.entity';
import { DB_LGI } from '@/core/config/database/database.module'
import { BienesLgiRepository } from './repository/bienes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BienesLgi], DB_LGI),
  ],
  controllers: [BienesController],
  providers: [BienesService, BienesLgiRepository],
  exports: [BienesService],
})
export class BienesModule {}
