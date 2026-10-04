import { Module } from '@nestjs/common';
import { SituacionBienLgiService } from './situacion_bien_lgi.service';
import { SituacionBienLgiController } from './situacion_bien_lgi.controller';
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections';
import { SituacionBien } from './entities/situacion-bienes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SituacionBien], DB_LGI)],
  controllers: [SituacionBienLgiController],
  providers: [SituacionBienLgiService],
})
export class SituacionBienLgiModule {}
