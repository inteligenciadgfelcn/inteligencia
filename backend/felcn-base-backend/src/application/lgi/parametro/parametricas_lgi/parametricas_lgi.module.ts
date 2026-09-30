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
import { TipoSituacionLegalBienLgiModule } from '../tipo_situcion_bien/tipo_situcion_bien.module'
import { InicioCasoRepository } from './repository/inicio_caso.repository'
import { TipoImplicadoRepository } from './repository/tipo_implicado.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipoImplicado } from './entity/tipo-implicado.entity'
import { DB_LGI } from '@/core/config/database/database.module'
import { CicloLgi } from './entity/ciclo.entity'
import { TipologiaLgi } from './entity/tipologia.entity'
import { VerboRectorLgi } from './entity/verbo-rector.entity'
import { CicloLgiRepository } from './repository/ciclo.repository'
import { TipologiaLgiRepository } from './repository/tipologia.repository'
import { VerboRectorLgiRepository } from './repository/verbo_rector.repository'

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
    TipoSituacionLegalBienLgiModule,
    TypeOrmModule.forFeature(
      [TipoImplicado, CicloLgi, VerboRectorLgi, TipologiaLgi],
      DB_LGI
    ),
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
    TipoInformeLgiRepository,
    InicioCasoRepository,
    TipoImplicadoRepository,
    CicloLgiRepository,
    VerboRectorLgiRepository,
    TipologiaLgiRepository,
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
    TipoInformeLgiRepository,
    InicioCasoRepository,
    TipoImplicadoRepository,
    CicloLgiRepository,
    VerboRectorLgiRepository,
    TipologiaLgiRepository,
  ],
})
export class ParametricasLgiModule {}
