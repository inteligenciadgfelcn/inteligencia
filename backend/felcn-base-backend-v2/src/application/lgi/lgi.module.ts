

import { Module } from '@nestjs/common'
import { UnidadModule } from './parametro/unidad/unidad.module';
import { BienesModule } from './parametro/bienes/bienes.module';
import { CatalogoClaseModule } from './parametro/catalogo-clase/catalogo-clase.module';
import { CatalogoCaracteristicasModule } from './parametro/catalogo-caracteristica/catalogo-caracteristicas.module';
import { CatalogoTipoModule } from './parametro/catalogo-tipo/catalogo-tipo.module';
import { CatalogoJuridicaModule } from './parametro/catalogo-juridica/catalogo-juridica.module';
import { SituacionLegalModule } from './parametro/situacion-legal/situacion-legal.module';
import { RecursosModule } from './parametro/recursos/recursos.module';
import { EtapaModule } from './parametro/etapa/etapa.module';
import { EstadoModule } from './parametro/estado/estado.module';
import { TipoPersonaModule } from './parametro/tipo-persona/tipo-persona.module';
import { ContenidoCasoModule } from './parametro/contenido-caso/contenido-caso.module';
import { GradoModule } from './parametro/grado/grado.module';
import { TamanoDocModule } from './parametro/tamano-doc/tamano-doc.module';
import { ContenidoBienModule } from './parametro/contenido-bien/contenido-bien.module';
import { CalidadBienModule } from './parametro/calidad-bien/calidad-bien.module';
import { AsignacionLgiModule } from './asignacion_lgi/asignacion_lgi.module';
import { ParametricasLgiModule } from './parametro/parametricas_lgi/parametricas_lgi.module';
import { PersonasImplicadasModule } from './personas_implicadas/personas_implicadas.module';
import { SituacionJuridicaModule } from './situacion_juridica/situacion_juridica.module';
import { InvestigadoresModule } from './investigadores/investigadores.module';

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
    AsignacionLgiModule,
    ParametricasLgiModule,
    PersonasImplicadasModule,
    SituacionJuridicaModule,
    InvestigadoresModule,
  ],
  controllers: [],
})
export class LgiModule {}