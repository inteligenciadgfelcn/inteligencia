import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_LGI } from '@/core/config/database/database.module'
import { VinculoLgi } from './entities/vinculo.entity';
import { VinculoLgiRepository } from './repository/vinculo.repository';
import { VinculoController } from './vinculo.controller';
import { VinculoService } from './vinculo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VinculoLgi], DB_LGI),
  ],
  controllers: [VinculoController],
  providers: [VinculoService, VinculoLgiRepository],
  exports: [VinculoService],
})
export class VinculoModule {}
