import { Module } from '@nestjs/common';
import { SituacionJuridicaBienService } from './situacion_juridica_bien.service';
import { SituacionJuridicaBienController } from './situacion_juridica_bien.controller';
import { DB_LGI } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BieneSecuestradoLgi } from '../bienes_secuestrados/entities/bienes_secuestrado.entity';
import { SituacionJuridicaBien } from './entities/situacion_juridica_bien.entity';
import { SituacionJuridicaBienRepository } from './repository/situacion-juridica-bien.repository';
import { CalidadBienLgi } from '../parametro/calidad-bien/entities/calidad-bien.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature(
      [
        SituacionJuridicaBien,
        BieneSecuestradoLgi,
        CalidadBienLgi,
      ],
      DB_LGI,
    ),
  ],

  controllers: [
    SituacionJuridicaBienController,
  ],

  providers: [
    SituacionJuridicaBienService,
    SituacionJuridicaBienRepository,
  ],

  exports: [
    SituacionJuridicaBienService,
  ],
})
export class SituacionJuridicaBienModule {}
