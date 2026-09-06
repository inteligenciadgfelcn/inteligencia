import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { PersonasJuridica } from '../personas_juridicas/entities/personas_juridica.entity'

import { SituacionJuridicaEmpresaRepository } from './repository/situacion_juridica_empresa.repository'
import { TipoSituacionJuridica } from '../parametro/parametricas_lgi/entity/tipo_situacion_juridica.entity'
import { SituacionJuridicaEmpresa } from './entities/situacion_jurica_empresa.entity'
import { SituacionJuridicaEmpresaController } from './situacion_jurica_empresa.controller'
import { SituacionJuridicaEmpresaService } from './situacion_jurica_empresa.service'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [SituacionJuridicaEmpresa, PersonasJuridica, TipoSituacionJuridica],
      DB_LGI
    ),
  ],

  controllers: [SituacionJuridicaEmpresaController],

  providers: [
    SituacionJuridicaEmpresaService,
    SituacionJuridicaEmpresaRepository,
  ],

  exports: [
    SituacionJuridicaEmpresaService,
    SituacionJuridicaEmpresaRepository,
  ],
})
export class SituacionJuridicaEmpresaModule {}
