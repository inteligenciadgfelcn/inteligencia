import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_SIII } from '../shared/constants'

// Geografía
import { Continente } from './parametrica/entity/geografia/continente.entity'
import { Pais } from './parametrica/entity/geografia/pais.entity'
import { PaisDestino } from './parametrica/entity/geografia/pais-destino.entity'
import { Departamento } from './parametrica/entity/geografia/departamento.entity'
import { Provincia } from './parametrica/entity/geografia/provincia.entity'
import { Localidad } from './parametrica/entity/geografia/localidad.entity'

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
import { Etapa } from './parametrica/entity/operativo/etapa.entity'
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

// Operativo - Entidad principal
import { Operativo } from './operativo/entity/operativo.entity'

// Operativo - Sub-entidades
import { Droga } from './operativo/entity/droga.entity'
import { SustanciaSolida } from './operativo/entity/sustancia-solida.entity'
import { SustanciaLiquida } from './operativo/entity/sustancia-liquida.entity'
import { Fabrica } from './operativo/entity/fabrica.entity'
import { ItemBienSecuestrado } from './operativo/entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from './operativo/entity/item-bien-caracteristica.entity'
import { DetenidoAuxiliar } from './operativo/entity/detenido-auxiliar.entity'
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

// Controllers
import { LookupController } from './parametrica/controller/lookup.controller'
import { OperativoController } from './operativo/controller/operativo.controller'

// Services
import { LookupService } from './parametrica/service/lookup.service'
import { OperativoService } from './operativo/service/operativo.service'

// Repositories
import { LookupRepository } from './parametrica/repository/lookup.repository'
import { OperativoRepository } from './operativo/repository/operativo.repository'

const entitiesParametricas = [
  // Geografía
  Continente,
  Pais,
  PaisDestino,
  Departamento,
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
  Etapa,
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
]

const entitiesOperativas = [
  // Operativo principal
  Operativo,
  // Sub-entidades
  Droga,
  SustanciaSolida,
  SustanciaLiquida,
  Fabrica,
  ItemBienSecuestrado,
  ItemBienCaracteristica,
  DetenidoAuxiliar,
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
]

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [...entitiesParametricas, ...entitiesOperativas],
      DB_SIII
    ),
  ],
  controllers: [LookupController, OperativoController],
  providers: [
    LookupService,
    OperativoService,
    LookupRepository,
    OperativoRepository,
  ],
  exports: [LookupService, OperativoService],
})
export class SiiiModule {}
