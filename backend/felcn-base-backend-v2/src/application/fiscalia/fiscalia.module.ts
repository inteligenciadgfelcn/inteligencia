import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MpCasoController } from './controller/mp-caso.controller'
import { MpDelitoController } from './controller/mp-delito.controller'
import { MpSujetoController } from './controller/mp-sujeto.controller'
import { MpFiscalController } from './controller/mp-fiscal.controller'
import { MpActividadController } from './controller/mp-actividad.controller'
import { MpReservaController } from './controller/mp-reserva.controller'
import { MpJuzgadoController } from './controller/mp-juzgado.controller'
import { MpAgendaController } from './controller/mp-agenda.controller'
import { CatalogoController } from './controller/catalogo.controller'
import { MpCasoService } from './service/mp-caso.service'
import { MpDelitoService } from './service/mp-delito.service'
import { MpSujetoService } from './service/mp-sujeto.service'
import { MpFiscalService } from './service/mp-fiscal.service'
import { MpActividadService } from './service/mp-actividad.service'
import { MpReservaService } from './service/mp-reserva.service'
import { MpJuzgadoService } from './service/mp-juzgado.service'
import { MpAgendaService } from './service/mp-agenda.service'
import { MpCasoRepository } from './repository/mp-caso.repository'
import { FiscaliaRepository } from './repository/fiscalia.repository'
import { MpEventoRecepcionRepository } from './repository/mp-evento-recepcion.repository'
import { EventoRecepcionInterceptor } from './interceptor/evento-recepcion.interceptor'
import { UnidadModule } from '../lgi/parametro/unidad/unidad.module'
import { BienesModule } from '../lgi/parametro/bienes/bienes.module'
import { CatalogoClaseModule } from '../lgi/parametro/catalogo-clase/catalogo-clase.module'
import { CatalogoCaracteristicasModule } from '../lgi/parametro/catalogo-caracteristica/catalogo-caracteristicas.module'
import { CatalogoTipoModule } from '../lgi/parametro/catalogo-tipo/catalogo-tipo.module'
import { CatalogoJuridicaModule } from '../lgi/parametro/catalogo-juridica/catalogo-juridica.module'
import { SituacionLegalModule } from '../lgi/parametro/situacion-legal/situacion-legal.module'
import { RecursosModule } from '../lgi/parametro/recursos/recursos.module'
import { EtapaModule } from '../lgi/parametro/etapa/etapa.module'
import { EstadoModule } from '../lgi/parametro/estado/estado.module'
import { TipoPersonaModule } from '../lgi/parametro/tipo-persona/tipo-persona.module'
import { ContenidoCasoModule } from '../lgi/parametro/contenido-caso/contenido-caso.module'
import { GradoModule } from '../lgi/parametro/grado/grado.module'
import { TamanoDocModule } from '../lgi/parametro/tamano-doc/tamano-doc.module'
import { ContenidoBienModule } from '../lgi/parametro/contenido-bien/contenido-bien.module'
import { CalidadBienModule } from '../lgi/parametro/calidad-bien/calidad-bien.module'

/**
 * Módulo Fiscalía (MP → POL)
 * Servicios que consume el Ministerio Público para enviar información de
 * casos (18 endpoints de recepción) y consultar catálogos (16 GET).
 * Endpoints abiertos: la seguridad la aplica el hub de interoperabilidad.
 * Staging propio en el schema fiscalia de felcn_siii; catálogos como
 * fachada sobre los services de lgi/parametro (BD felcn_lgi).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
@Module({
  imports: [
    ConfigModule,
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
  ],
  controllers: [
    MpCasoController,
    MpDelitoController,
    MpSujetoController,
    MpFiscalController,
    MpActividadController,
    MpReservaController,
    MpJuzgadoController,
    MpAgendaController,
    CatalogoController,
  ],
  providers: [
    MpCasoService,
    MpDelitoService,
    MpSujetoService,
    MpFiscalService,
    MpActividadService,
    MpReservaService,
    MpJuzgadoService,
    MpAgendaService,
    MpCasoRepository,
    FiscaliaRepository,
    MpEventoRecepcionRepository,
    EventoRecepcionInterceptor,
  ],
})
export class FiscaliaModule {}
