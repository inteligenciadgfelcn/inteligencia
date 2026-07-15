import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// Controllers de recepción (MP → POL) deshabilitados — versión oficial y
// pública del módulo Fiscalía es SOLO consulta (operativos/seguimientos) +
// catálogos. No se eliminan, solo se comentan, por si se retoma más
// adelante la retroalimentación con un diseño acordado.
// import { MpCasoController } from './controller/mp-caso.controller'
// import { MpDelitoController } from './controller/mp-delito.controller'
// import { MpSujetoController } from './controller/mp-sujeto.controller'
// import { MpFiscalController } from './controller/mp-fiscal.controller'
// import { MpActividadController } from './controller/mp-actividad.controller'
// import { MpReservaController } from './controller/mp-reserva.controller'
// import { MpJuzgadoController } from './controller/mp-juzgado.controller'
// import { MpAgendaController } from './controller/mp-agenda.controller'
import { CatalogoController } from './controller/catalogo.controller'
import { ConsultaOperativoController } from './controller/consulta-operativo.controller'
import { ConsultaSeguimientoController } from './controller/consulta-seguimiento.controller'
// import { MpCasoService } from './service/mp-caso.service'
// import { MpDelitoService } from './service/mp-delito.service'
// import { MpSujetoService } from './service/mp-sujeto.service'
// import { MpFiscalService } from './service/mp-fiscal.service'
// import { MpActividadService } from './service/mp-actividad.service'
// import { MpReservaService } from './service/mp-reserva.service'
// import { MpJuzgadoService } from './service/mp-juzgado.service'
// import { MpAgendaService } from './service/mp-agenda.service'
// import { MpCasoRepository } from './repository/mp-caso.repository'
// import { FiscaliaRepository } from './repository/fiscalia.repository'
import { MpEventoRecepcionRepository } from './repository/mp-evento-recepcion.repository'
import { ConsultaOperativoRepository } from './repository/consulta-operativo.repository'
import { ConsultaSeguimientoRepository } from './repository/consulta-seguimiento.repository'
import { ConsultaOperativoService } from './service/consulta-operativo.service'
import { ConsultaSeguimientoService } from './service/consulta-seguimiento.service'
import { EventoRecepcionInterceptor } from './interceptor/evento-recepcion.interceptor'
import { SiiiModule } from '../sunesis/siii/siii.module'
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
 * Módulo Fiscalía (MP → POL) — VERSIÓN OFICIAL Y PÚBLICA.
 * Expone exclusivamente:
 *  - 4 APIs de consulta de solo lectura: GET /operativos, /operativos/{cud},
 *    /seguimientos, /seguimientos/{cud} — cabecera en el listado, detalle
 *    anidado completo por cud, catálogos resueltos a descripción.
 *  - 16 catálogos GET (fachada sobre los services de lgi/parametro).
 * Los 18 endpoints de recepción (POST/PATCH) quedan comentados en este
 * archivo — no eliminados — a la espera de un diseño acordado de
 * retroalimentación.
 * Endpoints abiertos: la seguridad la aplica el hub de interoperabilidad.
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
@Module({
  imports: [
    ConfigModule,
    SiiiModule,
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
    // MpCasoController,
    // MpDelitoController,
    // MpSujetoController,
    // MpFiscalController,
    // MpActividadController,
    // MpReservaController,
    // MpJuzgadoController,
    // MpAgendaController,
    CatalogoController,
    ConsultaOperativoController,
    ConsultaSeguimientoController,
  ],
  providers: [
    // MpCasoService,
    // MpDelitoService,
    // MpSujetoService,
    // MpFiscalService,
    // MpActividadService,
    // MpReservaService,
    // MpJuzgadoService,
    // MpAgendaService,
    // MpCasoRepository,
    // FiscaliaRepository,
    MpEventoRecepcionRepository,
    EventoRecepcionInterceptor,
    ConsultaOperativoRepository,
    ConsultaOperativoService,
    ConsultaSeguimientoRepository,
    ConsultaSeguimientoService,
  ],
})
export class FiscaliaModule {}
