import { Module } from '@nestjs/common';
import { BienesIdentificadosPdService } from './bienes_identificados_pd.service';
import { BienesIdentificadosPdController } from './bienes_identificados_pd.controller';
import { BieneSecuestradoLgi } from '@/application/lgi/bienes_secuestrados/entities/bienes_secuestrado.entity';
import { FotoBienLgi } from '@/application/lgi/foto_bienes/entities/foto_biene.entity';
import { DB_LGI } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BienSecuestradoPdRepository } from './repository/bien_secuestrado_pd.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BieneSecuestradoLgi,FotoBienLgi], DB_LGI)],
  controllers: [BienesIdentificadosPdController],
  providers: [BienesIdentificadosPdService,BienSecuestradoPdRepository],
  exports: [BienesIdentificadosPdService,BienSecuestradoPdRepository],
})
export class BienesIdentificadosPdModule {}
