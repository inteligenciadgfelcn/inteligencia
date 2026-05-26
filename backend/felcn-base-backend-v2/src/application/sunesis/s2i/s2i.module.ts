import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_S2I } from '../shared/constants'

// ==================== PARAMÉTRICAS ====================
import { S2iContinente } from './parametrica/entity/continente.entity'
import { S2iPais } from './parametrica/entity/pais.entity'
import { S2iEstadoCaso } from './parametrica/entity/estado-caso.entity'
import { S2iEtapaInvestigacion } from './parametrica/entity/etapa-investigacion.entity'
import { S2iTipoDelito } from './parametrica/entity/tipo-delito.entity'
import { S2iTipoOrganizacion } from './parametrica/entity/tipo-organizacion.entity'
import { S2iTipoInvestigacionBien } from './parametrica/entity/tipo-investigacion-bien.entity'
import { S2iContenidoCaso } from './parametrica/entity/contenido-caso.entity'
import { S2iBien } from './parametrica/entity/bien.entity'
import { S2aCatalogoClase } from './parametrica/entity/catalogo-clase.entity'
import { S2aCatalogoTipo } from './parametrica/entity/catalogo-tipo.entity'
import { S2aCatalogoCaracteristica } from './parametrica/entity/catalogo-caracteristica.entity'

// ==================== CASO ====================
import { S2iAsignacion } from './caso/entity/asignacion.entity'

// ==================== BLANCO ====================
import { S2iBlanco } from './blanco/entity/blanco.entity'
import { S2iAntecedenteBlanco } from './blanco/entity/antecedente-blanco.entity'
import { S2iRedSocial } from './blanco/entity/red-social.entity'
import { S2iLugarBlanco } from './blanco/entity/lugar-blanco.entity'
import { S2iArchivoBlanco } from './blanco/entity/archivo-blanco.entity'

// ==================== ORGANIZACIÓN ====================
import { S2iEmpresa } from './organizacion/entity/empresa.entity'
import { S2iLugarEmpresa } from './organizacion/entity/lugar-empresa.entity'
import { S2iArchivoOrganizacion } from './organizacion/entity/archivo-organizacion.entity'

// ==================== BIEN ====================
import { S2iItemBienInvestigado } from './bien/entity/item-bien-investigado.entity'
import { S2iItemBienCaracteristica } from './bien/entity/item-bien-caracteristica.entity'
import { S2iLugarBien } from './bien/entity/lugar-bien.entity'
import { S2iArchivoBien } from './bien/entity/archivo-bien.entity'

// ==================== CONTROLLERS ====================
import { S2iLookupController } from './parametrica/controller/s2i-lookup.controller'
import { CasoController } from './caso/controller/caso.controller'
import { BlancoController } from './blanco/controller/blanco.controller'
import { OrganizacionController } from './organizacion/controller/organizacion.controller'
import { BienController } from './bien/controller/bien.controller'

// ==================== SERVICES ====================
import { S2iLookupService } from './parametrica/service/s2i-lookup.service'
import { CasoService } from './caso/service/caso.service'
import { BlancoService } from './blanco/service/blanco.service'
import { OrganizacionService } from './organizacion/service/organizacion.service'
import { BienService } from './bien/service/bien.service'

// ==================== REPOSITORIES ====================
import { S2iLookupRepository } from './parametrica/repository/s2i-lookup.repository'
import { CasoRepository } from './caso/repository/caso.repository'
import { BlancoRepository } from './blanco/repository/blanco.repository'
import { OrganizacionRepository } from './organizacion/repository/organizacion.repository'
import { BienRepository } from './bien/repository/bien.repository'

const entities = [
  // Paramétricas
  S2iContinente,
  S2iPais,
  S2iEstadoCaso,
  S2iEtapaInvestigacion,
  S2iTipoDelito,
  S2iTipoOrganizacion,
  S2iTipoInvestigacionBien,
  S2iContenidoCaso,
  S2iBien,
  S2aCatalogoClase,
  S2aCatalogoTipo,
  S2aCatalogoCaracteristica,
  // Caso
  S2iAsignacion,
  // Blanco
  S2iBlanco,
  S2iAntecedenteBlanco,
  S2iRedSocial,
  S2iLugarBlanco,
  S2iArchivoBlanco,
  // Organización
  S2iEmpresa,
  S2iLugarEmpresa,
  S2iArchivoOrganizacion,
  // Bien
  S2iItemBienInvestigado,
  S2iItemBienCaracteristica,
  S2iLugarBien,
  S2iArchivoBien,
]

@Module({
  imports: [TypeOrmModule.forFeature(entities, DB_S2I)],
  controllers: [
    S2iLookupController,
    CasoController,
    BlancoController,
    OrganizacionController,
    BienController,
  ],
  providers: [
    S2iLookupService,
    S2iLookupRepository,
    CasoService,
    CasoRepository,
    BlancoService,
    BlancoRepository,
    OrganizacionService,
    OrganizacionRepository,
    BienService,
    BienRepository,
  ],
  exports: [
    S2iLookupService,
    CasoService,
    BlancoService,
    OrganizacionService,
    BienService,
  ],
})
export class S2iModule {}
