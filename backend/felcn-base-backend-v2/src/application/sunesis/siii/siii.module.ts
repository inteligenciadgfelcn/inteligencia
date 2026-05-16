import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { DB_SIII, DB_LGI } from '../shared/constants'


// Geografía
import { Continente } from './parametrica/entity/geografia/continente.entity'
import { Pais } from './parametrica/entity/geografia/pais.entity'
import { PaisDestino } from './parametrica/entity/geografia/pais-destino.entity'
import { Departamento } from './parametrica/entity/geografia/departamento.entity'
import { Provincia } from './parametrica/entity/geografia/provincia.entity'
import { Localidad } from './parametrica/entity/geografia/localidad.entity'
import { DepartamentoCaso } from './parametrica/entity/geografia/departamento-caso.entity'

// Tipos
import { TipoDroga } from './parametrica/entity/tipo/tipo-droga.entity'
import { TipoOperacion } from './parametrica/entity/tipo/tipo-operacion.entity'
import { TipoPenal } from './parametrica/entity/tipo/tipo-penal.entity'
import { TipoRelevancia } from './parametrica/entity/tipo/tipo-relevancia.entity'
import { TipoPersona } from './parametrica/entity/tipo/tipo-persona.entity'
import { TipoImplicado } from './parametrica/entity/tipo/tipo-implicado.entity'
import { TipoFabrica } from './parametrica/entity/tipo/tipo-fabrica.entity'
import { TipoDocumento } from './parametrica/entity/tipo/tipo-documento.entity'
import { TipoDenuncia } from './parametrica/entity/tipo/tipo-denuncia.entity'

// Persona
import { EstadoCivil } from './parametrica/entity/persona/estado-civil.entity'
import { ColorPiel } from './parametrica/entity/persona/color-piel.entity'
import { ColorOjos } from './parametrica/entity/persona/color-ojos.entity'
import { ColorCabello } from './parametrica/entity/persona/color-cabello.entity'
import { TipoCabello } from './parametrica/entity/persona/tipo-cabello.entity'

// Operativo params
import { CategoriaOperativo } from './parametrica/entity/operativo/categoria-operativo.entity'
import { PlanOperaciones } from './parametrica/entity/operativo/plan-operaciones.entity'
import { EtapaOperativo } from './parametrica/entity/operativo/etapa.entity'
import { EtapaInvestigacion } from './parametrica/entity/operativo/etapa-investigacion.entity'
import { FormaTransporte } from './parametrica/entity/operativo/forma-transporte.entity'
import { Recurso } from './parametrica/entity/operativo/recurso.entity'
import { TamanioDocumento } from './parametrica/entity/operativo/tamanio-documento.entity'

// Sustancia
import { SustanciaSolidaDescripcion } from './parametrica/entity/sustancia/sustancia-solida-descripcion.entity'
import { SustanciaLiquidaDescripcion } from './parametrica/entity/sustancia/sustancia-liquida-descripcion.entity'
import { CocaProcedencia } from './parametrica/entity/sustancia/coca-procedencia.entity'
import { CocaEstado } from './parametrica/entity/sustancia/coca-estado.entity'
import { CocaDescripcion } from './parametrica/entity/sustancia/coca-descripcion.entity'
import { SituacionLegal } from './parametrica/entity/sustancia/situacion-legal.entity'

// Bien
import { Bienes } from './parametrica/entity/bien/bienes.entity'
import { CalidadBien } from './parametrica/entity/bien/calidad-bien.entity'
import { ContenidoBien } from './parametrica/entity/bien/contenido-bien.entity'
import { ContenidoCaso } from './parametrica/entity/bien/contenido-caso.entity'
import { Grado } from './parametrica/entity/bien/grado.entity'
import { Letra } from './parametrica/entity/bien/letra.entity'

// Estructura organizacional (público)
import { Unidad } from './parametrica/entity/estructura/unidad.entity'
import { Distrital } from './parametrica/entity/estructura/distrital.entity'
import { Grupo } from './parametrica/entity/estructura/grupo.entity'

// Asignación (felcn_siii.public.asignacion — Insert S3 / muestradatos / muestranoaprob)
import { AsignacionSiii } from './asignacion/entity/asignacion-siii.entity'

// Operativo - Entidad principal
import { Operativo } from './operativo/entity/operativo.entity'

// Operativo - Sub-entidades
import { Droga } from './operativo/entity/droga.entity'
import { SustanciaSolida } from './operativo/entity/sustancia-solida.entity'
import { SustanciaLiquida } from './operativo/entity/sustancia-liquida.entity'
import { Fabrica } from './operativo/entity/fabrica.entity'
import { ItemBienSecuestrado } from './operativo/entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from './operativo/entity/item-bien-caracteristica.entity'
import { ArrestadoAuxiliar } from './operativo/entity/arrestado-auxiliar.entity'
import { Galeria } from './operativo/entity/galeria.entity'
import { Logotipo } from './operativo/entity/logotipo.entity'
import { Coca } from './operativo/entity/coca.entity'
import { ServidorPolicial } from './operativo/entity/servidor-policial.entity'

// Operativo - Catálogos
import { CatalogoClase } from './operativo/entity/catalogo-clase.entity'
import { CatalogoTipo } from './operativo/entity/catalogo-tipo.entity'
import { CatalogoCaracteristica } from './operativo/entity/catalogo-caracteristica.entity'
import { FabricaModelo } from './operativo/entity/fabrica-modelo.entity'
import { EstadoDroga } from './operativo/entity/estado-droga.entity'
import { ItemOperativo } from './operativo/entity/item-operativo.entity'

// Investigación Paralela
import { InvestigacionParalela } from './investigacion/paralelo/entity/investigacion-paralela.entity'
import { Investigador } from './investigacion/paralelo/entity/investigador.entity'
import { InvestigacionController } from './investigacion/paralelo/controller/investigacion.controller'
import { InvestigacionService } from './investigacion/paralelo/service/investigacion.service'
import { InvestigacionRepository } from './investigacion/paralelo/repository/investigacion.repository'

// LGI — Sistema legacy GIAEF (felcn_lgi)
import { LgiController } from './investigacion/lgi/controller/lgi.controller'
import { LgiService } from './investigacion/lgi/service/lgi.service'
import { LgiRepository } from './investigacion/lgi/repository/lgi.repository'

// Seguimiento
import { Fiscal } from './seguimiento/casos/entity/fiscal.entity'
import { Jurisdiccion } from './seguimiento/casos/entity/jurisdiccion.entity'
import { ControlJurisdiccional } from './seguimiento/casos/entity/control-jurisdiccional.entity'
import { Archivo } from './seguimiento/casos/entity/archivo.entity'
import { SeguimientoController } from './seguimiento/casos/controller/seguimiento.controller'
import { SeguimientoService } from './seguimiento/casos/service/seguimiento.service'
import { SeguimientoRepository } from './seguimiento/casos/repository/seguimiento.repository'

// Seguimiento - Asignaciones Ingreso (FRM-INF-ING)
import { AsignacionesIngresoController } from './seguimiento/asignaciones/controller/asignaciones-ingreso.controller'
import { AsignacionesIngresoService } from './seguimiento/asignaciones/service/asignaciones-ingreso.service'
import { AsignacionesIngresoRepository } from './seguimiento/asignaciones/repository/asignaciones-ingreso.repository'

// Seguimiento - Personas (FRM-JUR-02)
import { DetenidoAuxiliar } from './seguimiento/personas/entity/detenido-auxiliar.entity'
import { Situacion } from './seguimiento/personas/entity/situacion.entity'
import { EtapaProceso } from './seguimiento/personas/entity/etapa-proceso.entity'
import { Estado } from './seguimiento/personas/entity/estado.entity'
import { PersonasController } from './seguimiento/personas/controller/personas.controller'
import { PersonasService } from './seguimiento/personas/service/personas.service'
import { PersonasRepository } from './seguimiento/personas/repository/personas.repository'

// Seguimiento - Bienes (FRM-JUR-03)
import { BienSecuestrado } from './seguimiento/bienes/entity/bien-secuestrado.entity'
import { BienIncautado } from './seguimiento/bienes/entity/bien-incautado.entity'
import { BienConfiscado } from './seguimiento/bienes/entity/bien-confiscado.entity'
import { PerdidaDominio } from './seguimiento/bienes/entity/perdida-dominio.entity'
import { SituacionBien } from './seguimiento/bienes/entity/situacion-bien.entity'
import { ArchivoBien } from './seguimiento/bienes/entity/archivo-bien.entity'
import { BienesController } from './seguimiento/bienes/controller/bienes.controller'
import { BienesService } from './seguimiento/bienes/service/bienes.service'
import { BienesRepository } from './seguimiento/bienes/repository/bienes.repository'

// Controllers
import { LookupController } from './parametrica/controller/lookup.controller'
import { OperativoController } from './operativo/controller/operativo.controller'

// Services
import { LookupService } from './parametrica/service/lookup.service'
import { OperativoService } from './operativo/service/operativo.service'

// Repositories
import { LookupRepository } from './parametrica/repository/lookup.repository'
import { OperativoRepository } from './operativo/repository/operativo.repository'
import { AsignacionSiiiRepository } from './asignacion/repository/asignacion-siii.repository'

const entitiesParametricas = [
  // Geografía
  Continente,
  Pais,
  PaisDestino,
  Departamento,
  DepartamentoCaso,
  Provincia,
  Localidad,
  // Tipos
  TipoDroga,
  TipoOperacion,
  TipoPenal,
  TipoRelevancia,
  TipoPersona,
  TipoImplicado,
  TipoFabrica,
  TipoDocumento,
  TipoDenuncia,
  // Persona
  EstadoCivil,
  ColorPiel,
  ColorOjos,
  ColorCabello,
  TipoCabello,
  // Operativo params
  CategoriaOperativo,
  PlanOperaciones,
  EtapaOperativo,
  EtapaInvestigacion,
  FormaTransporte,
  Recurso,
  TamanioDocumento,
  // Sustancia
  SustanciaSolidaDescripcion,
  SustanciaLiquidaDescripcion,
  CocaProcedencia,
  CocaEstado,
  CocaDescripcion,
  SituacionLegal,
  // Bien
  Bienes,
  CalidadBien,
  ContenidoBien,
  ContenidoCaso,
  Grado,
  Letra,
  // Estructura organizacional
  Unidad,
  Distrital,
  Grupo,
]

const entitiesOperativas = [
  // Asignación (felcn_siii)
  AsignacionSiii,
  // Operativo principal
  Operativo,
  // Sub-entidades
  Droga,
  SustanciaSolida,
  SustanciaLiquida,
  Fabrica,
  ItemBienSecuestrado,
  ItemBienCaracteristica,
  ArrestadoAuxiliar,
  Galeria,
  Logotipo,
  Coca,
  ServidorPolicial,
  // Catálogos operativos
  CatalogoClase,
  CatalogoTipo,
  CatalogoCaracteristica,
  FabricaModelo,
  EstadoDroga,
  ItemOperativo,
  // Casos Paralelos
  InvestigacionParalela,
  Investigador,
  // Seguimiento
  Fiscal,
  Jurisdiccion,
  ControlJurisdiccional,
  Archivo,
  // Seguimiento - Personas
  DetenidoAuxiliar,
  Situacion,
  EtapaProceso,
  Estado,
  // Seguimiento - Bienes
  BienSecuestrado,
  BienIncautado,
  BienConfiscado,
  PerdidaDominio,
  SituacionBien,
  ArchivoBien,
]

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature(
      [...entitiesParametricas, ...entitiesOperativas],
      DB_SIII
    ),
  ],
  controllers: [
    LookupController,
    OperativoController,
    InvestigacionController,
    SeguimientoController,
    AsignacionesIngresoController,
    PersonasController,
    BienesController,
    LgiController,
  ],
  providers: [
    LookupService,
    OperativoService,
    InvestigacionService,
    SeguimientoService,
    LookupRepository,
    OperativoRepository,
    AsignacionSiiiRepository,
    InvestigacionRepository,
    SeguimientoRepository,
    AsignacionesIngresoService,
    AsignacionesIngresoRepository,
    PersonasService,
    PersonasRepository,
    BienesService,
    BienesRepository,
    LgiService,
    LgiRepository,
  ],
  exports: [
    LookupService,
    OperativoService,
    InvestigacionService,
    SeguimientoService,
    PersonasService,
    BienesService,
    LgiService,
  ],
})
export class SiiiModule { }
