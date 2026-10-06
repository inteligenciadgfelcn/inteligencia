import { Module } from '@nestjs/common'
import { UnidadModule } from './parametro/unidad/unidad.module'
import { BienesModule } from './parametro/bienes/bienes.module'
import { CatalogoClaseModule } from './parametro/catalogo-clase/catalogo-clase.module'
import { CatalogoCaracteristicasModule } from './parametro/catalogo-caracteristica/catalogo-caracteristicas.module'
import { CatalogoTipoModule } from './parametro/catalogo-tipo/catalogo-tipo.module'
import { CatalogoJuridicaModule } from './parametro/catalogo-juridica/catalogo-juridica.module'
import { SituacionLegalModule } from './parametro/situacion-legal/situacion-legal.module'
import { RecursosModule } from './parametro/recursos/recursos.module'
import { EtapaModule } from './parametro/etapa/etapa.module'
import { EstadoModule } from './parametro/estado/estado.module'
import { TipoPersonaModule } from './parametro/tipo-persona/tipo-persona.module'
import { ContenidoCasoModule } from './parametro/contenido-caso/contenido-caso.module'
import { GradoModule } from './parametro/grado/grado.module'
import { TamanoDocModule } from './parametro/tamano-doc/tamano-doc.module'
import { ContenidoBienModule } from './parametro/contenido-bien/contenido-bien.module'
import { CalidadBienModule } from './parametro/calidad-bien/calidad-bien.module'
import { AsignacionLgiModule } from './asignacion_lgi/asignacion_lgi.module'
import { ParametricasLgiModule } from './parametro/parametricas_lgi/parametricas_lgi.module'
import { PersonasImplicadasModule } from './personas_implicadas/personas_implicadas.module'
import { SituacionJuridicaModule } from './situacion_juridica/situacion_juridica.module'
import { InvestigadoresModule } from './investigadores/investigadores.module'
import { InformacionSiiiModule } from './informacion_siii/informacion_siii.module'
import { ActuacionesModule } from './actuaciones/actuaciones.module'
import { BienesSecuestradosModule } from './bienes_secuestrados/bienes_secuestrados.module'
import { VinculoModule } from './parametro/vinculo/vinculo.module'
import { TipoVinculoModule } from './parametro/tipo-vinculo/tipo-vinculo.module'
import { CaracteristicasBienesModule } from './caracteristicas_bienes/caracteristicas_bienes.module'
import { SituacionJuridicaBienModule } from './situacion_juridica_bien/situacion_juridica_bien.module'
import { PersonasJuridicasModule } from './personas_juridicas/personas_juridicas.module'
import { SituacionJuridicaEmpresaModule } from './situacion_jurica_empresa/situacion_jurica_empresa.module'
import { ReportesLgiModule } from './reportes_lgi/reportes_lgi.module';
import { PresedenciaLgiModule } from './presedencia_lgi/presedencia_lgi.module';
import { ImplicadosModule } from './implicados/implicados.module';
import { ConclusionCasoModule } from './conclusion_caso/conclusion_caso.module';
import { ImplicadosBienModule } from './implicados_bien/implicados_bien.module';
import { VinculoBienLgiModule } from './vinculo_bien_lgi/vinculo_bien_lgi.module';
import { SituacionBienLgiModule } from './situacion_bien_lgi/situacion_bien_lgi.module';

@Module({
  imports: [
    UnidadModule,
    BienesModule,
    CatalogoClaseModule,
    CatalogoCaracteristicasModule,
    CatalogoTipoModule,
    CatalogoJuridicaModule,
    SituacionLegalModule,
    RecursosModule,
    EtapaModule,
    EstadoModule,
    TipoPersonaModule,
    ContenidoCasoModule,
    GradoModule,
    TamanoDocModule,
    ContenidoBienModule,
    CalidadBienModule,
    VinculoModule,
    TipoVinculoModule,
    ParametricasLgiModule,
    AsignacionLgiModule,
    ActuacionesModule,
    PersonasImplicadasModule,
    SituacionJuridicaModule,
    InvestigadoresModule,
    InformacionSiiiModule,
    PresedenciaLgiModule,
    BienesSecuestradosModule,
    CaracteristicasBienesModule,
    ImplicadosBienModule,
    VinculoBienLgiModule,
    SituacionBienLgiModule,
    SituacionJuridicaBienModule,
    PersonasJuridicasModule,
    ImplicadosModule,
    SituacionJuridicaEmpresaModule,
    ConclusionCasoModule,
    ReportesLgiModule,
  ],
  controllers: [],
})
export class LgiModule {}
