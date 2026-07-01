import { Module } from '@nestjs/common';
import { CatalogoFiscaliaController } from './catalogo-fiscalia.controller';
import { UnidadModule } from '../lgi/parametro/unidad/unidad.module';
import { BienesModule } from '../lgi/parametro/bienes/bienes.module';
import { CatalogoClaseModule } from '../lgi/parametro/catalogo-clase/catalogo-clase.module';
import { CatalogoCaracteristicasModule } from '../lgi/parametro/catalogo-caracteristica/catalogo-caracteristicas.module';
import { CatalogoTipoModule } from '../lgi/parametro/catalogo-tipo/catalogo-tipo.module';
import { CatalogoJuridicaModule } from '../lgi/parametro/catalogo-juridica/catalogo-juridica.module';
import { SituacionLegalModule } from '../lgi/parametro/situacion-legal/situacion-legal.module';
import { RecursosModule } from '../lgi/parametro/recursos/recursos.module';
import { EstadoModule } from '../lgi/parametro/estado/estado.module';
import { TipoPersonaModule } from '../lgi/parametro/tipo-persona/tipo-persona.module';
import { ContenidoCasoModule } from '../lgi/parametro/contenido-caso/contenido-caso.module';
import { GradoModule } from '../lgi/parametro/grado/grado.module';
import { TamanoDocModule } from '../lgi/parametro/tamano-doc/tamano-doc.module';
import { ContenidoBienModule } from '../lgi/parametro/contenido-bien/contenido-bien.module';
import { CalidadBienModule } from '../lgi/parametro/calidad-bien/calidad-bien.module';
import { EtapaModule } from '../lgi/parametro/etapa/etapa.module';

@Module({
  imports: [UnidadModule, BienesModule, CatalogoClaseModule, CatalogoCaracteristicasModule, CatalogoTipoModule, CatalogoJuridicaModule, SituacionLegalModule,
    RecursosModule,
    EstadoModule,
    EtapaModule,
    TipoPersonaModule,
    ContenidoCasoModule,
    GradoModule,
    TamanoDocModule,
    ContenidoBienModule,
    CalidadBienModule,
  ],
  controllers: [CatalogoFiscaliaController]
})
export class CatalogoFiscaliaModule {}
