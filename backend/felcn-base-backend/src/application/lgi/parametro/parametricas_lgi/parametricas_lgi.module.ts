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
import { BienesModule } from '../bienes/bienes.module'
import { CatalogoClaseModule } from '../catalogo-clase/catalogo-clase.module'
import { CatalogoTipoModule } from '../catalogo-tipo/catalogo-tipo.module'
import { CatalogoCaracteristicasModule } from '../catalogo-caracteristica/catalogo-caracteristicas.module'
import { CalidadBienModule } from '../calidad-bien/calidad-bien.module'
import { VinculoModule } from '../vinculo/vinculo.module'
import { TipoVinculoModule } from '../tipo-vinculo/tipo-vinculo.module'

@Module({
   imports: [
    EtapaModule,
    EstadoModule,
    BienesModule,
    CatalogoClaseModule,
    CatalogoTipoModule,
    CatalogoCaracteristicasModule,
    CalidadBienModule,
    VinculoModule,
    TipoVinculoModule,
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
