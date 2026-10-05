import { Module } from '@nestjs/common';
import { VinculoBienLgiService } from './vinculo_bien_lgi.service';
import { VinculoBienLgiController } from './vinculo_bien_lgi.controller';
import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections';
import { VinculoBienLgi } from './entities/vinculo_bien_lgi.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinculoBienLgiRepository } from './repository/vinculo_bien_lgi.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VinculoBienLgi], DB_LGI)],
  controllers: [VinculoBienLgiController],
  providers: [VinculoBienLgiService, VinculoBienLgiRepository],
})
export class VinculoBienLgiModule {}
