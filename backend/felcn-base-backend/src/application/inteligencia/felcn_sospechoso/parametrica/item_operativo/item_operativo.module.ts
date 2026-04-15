import { Module } from '@nestjs/common';
import { ItemOperativoService } from './item_operativo.service';
import { ItemOperativoController } from './item_operativo.controller';
import { ItemOperativo } from './entities/item_operativo.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
    TypeOrmModule.forFeature([ItemOperativo], DB_SOSPECHOSO),
  ],
  controllers: [ItemOperativoController],
  providers: [ItemOperativoService],
    exports: [ItemOperativoService],
})
export class ItemOperativoModule {}
