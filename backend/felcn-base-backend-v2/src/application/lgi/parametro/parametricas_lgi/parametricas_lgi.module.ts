import { Module } from '@nestjs/common'
import { ParametricasLgiService } from './parametricas_lgi.service'
import { ParametricasLgiController } from './parametricas_lgi.controller'
import { DistritalLgiRepository } from './repository/distrito.repository'
import { GrupoLgiRepository } from './repository/grupo.repository'
import { DepartamentoLgiRepository } from './repository/departamento.repository'
import { SituacionJuridicaRepository } from './repository/situacion_juridica.repository'
import { PaisLgiRepository } from './repository/pais.repository'
import { EstadoCivilLgiRepository } from './repository/estado_civil.repository'
import { ProfesionLgiRepository } from './repository/profesion.repository'
import { TipoDocumentoLgiRepository } from './repository/tipo_documento.repository'
import { EtapaModule } from '../etapa/etapa.module'
import { EstadoModule } from '../estado/estado.module'
import { TipoInformeLgiRepository } from './repository/tipo_informe.repository'

@Module({
   imports: [
    EtapaModule,
    EstadoModule,
  ],

  controllers: [ParametricasLgiController],
  providers: [
    ParametricasLgiService,
    DistritalLgiRepository,
    GrupoLgiRepository,
    DepartamentoLgiRepository,
    SituacionJuridicaRepository,
    PaisLgiRepository,
    EstadoCivilLgiRepository,
    ProfesionLgiRepository,
    TipoDocumentoLgiRepository,
    TipoInformeLgiRepository
  ],
  exports: [
    ParametricasLgiService,
    DistritalLgiRepository,
    GrupoLgiRepository,
    DepartamentoLgiRepository,
    SituacionJuridicaRepository,
    PaisLgiRepository,
    EstadoCivilLgiRepository,
    ProfesionLgiRepository,
    TipoDocumentoLgiRepository,
    TipoInformeLgiRepository
  ],
})
export class ParametricasLgiModule {}
