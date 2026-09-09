import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { BieneSecuestradoLgi } from '../bienes_secuestrados/entities/bienes_secuestrado.entity'

import { BienSecuestado } from './entities/bien-secuestrado.entity'

import { BienIncautado } from './entities/bien-incautado.entity'

import { BienConfiscado } from './entities/bien_confiscado.entity'

import { SituacionBien } from './entities/situacion-bienes.entity'

import { SituacionJuridicaBienController } from './situacion_juridica_bien.controller'

import { SituacionJuridicaBienService } from './situacion_juridica_bien.service'

import { SituacionJuridicaBienRepository } from './repository/situacion-juridica-bien.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        BieneSecuestradoLgi,
        BienSecuestado,
        BienIncautado,
        BienConfiscado,
        SituacionBien,
      ],
      DB_LGI
    ),
  ],

  controllers: [SituacionJuridicaBienController],

  providers: [SituacionJuridicaBienService, SituacionJuridicaBienRepository],

  exports: [SituacionJuridicaBienService, SituacionJuridicaBienRepository],
})
export class SituacionJuridicaBienModule {}
