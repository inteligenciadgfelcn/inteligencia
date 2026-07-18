import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'

import { S2iBien } from '../entity/bien.entity'
import { S2aCatalogoClase } from '../entity/catalogo-clase.entity'
import { S2aCatalogoTipo } from '../entity/catalogo-tipo.entity'
import { S2aCatalogoCaracteristica } from '../entity/catalogo-caracteristica.entity'
import { S2iContenidoCaso } from '../entity/contenido-caso.entity'
import { S2iContinente } from '../entity/continente.entity'
import { S2iPais } from '../entity/pais.entity'
import { S2iEstadoCaso } from '../entity/estado-caso.entity'
import { S2iEtapaInvestigacion } from '../entity/etapa-investigacion.entity'
import { S2iTipoDelito } from '../entity/tipo-delito.entity'
import { S2iTipoInvestigacionBien } from '../entity/tipo-investigacion-bien.entity'
import { S2iTipoOrganizacion } from '../entity/tipo-organizacion.entity'
import { S2iTipoActivo } from '../entity/tipo-activo.entity'
import { S2iColor } from '../entity/color.entity'

@Injectable()
export class S2iLookupRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // ==================== GEOGRAFÍA ====================

  async listarContinentes(): Promise<S2iContinente[]> {
    return this.dataSource
      .getRepository(S2iContinente)
      .find({ order: { descripcion: 'ASC' } })
  }

  /** Si se provee idContinente filtra países por continente (ej. 4 = Sudamérica) */
  async listarPaises(idContinente?: number): Promise<S2iPais[]> {
    const where = idContinente ? { idContinente } : {}
    return this.dataSource
      .getRepository(S2iPais)
      .find({ where, order: { descripcion: 'ASC' } })
  }

  // ==================== CATÁLOGOS DE CASO ====================

  async listarEstadosCaso(): Promise<S2iEstadoCaso[]> {
    return this.dataSource
      .getRepository(S2iEstadoCaso)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarEtapasInvestigacion(): Promise<S2iEtapaInvestigacion[]> {
    return this.dataSource
      .getRepository(S2iEtapaInvestigacion)
      .find({ order: { id: 'ASC' } })
  }

  async listarTiposDelito(): Promise<S2iTipoDelito[]> {
    return this.dataSource
      .getRepository(S2iTipoDelito)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposOrganizacion(): Promise<S2iTipoOrganizacion[]> {
    return this.dataSource
      .getRepository(S2iTipoOrganizacion)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarContenidoCaso(): Promise<S2iContenidoCaso[]> {
    return this.dataSource
      .getRepository(S2iContenidoCaso)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarTiposActivo(): Promise<S2iTipoActivo[]> {
    return this.dataSource
      .getRepository(S2iTipoActivo)
      .find({ order: { descripcion: 'ASC' } })
  }

  // ==================== CATÁLOGO DE BIENES (jerarquía 3 niveles) ====================

  async listarBienes(): Promise<S2iBien[]> {
    return this.dataSource
      .getRepository(S2iBien)
      .find({ order: { descripcion: 'ASC' } })
  }

  async listarClasesPorBien(idBien: number): Promise<S2aCatalogoClase[]> {
    return this.dataSource.getRepository(S2aCatalogoClase).find({
      where: { idBien },
      order: { descripcion: 'ASC' },
    })
  }

  async listarTiposPorClase(
    idCatalogoClase: number
  ): Promise<S2aCatalogoTipo[]> {
    return this.dataSource.getRepository(S2aCatalogoTipo).find({
      where: { idCatalogoClase },
      order: { descripcion: 'ASC' },
    })
  }

  /**
   * Características disponibles para el bien que contiene un tipo dado.
   * El frontend filtra por el tipo seleccionado — retorna las características de su clase padre.
   */
  async listarCaracteristicasPorTipo(
    idCatalogoTipo: number
  ): Promise<S2aCatalogoCaracteristica[]> {
    return this.dataSource
      .getRepository(S2aCatalogoCaracteristica)
      .createQueryBuilder('cc')
      .innerJoin(
        S2aCatalogoTipo,
        'ct',
        'ct.idCatalogoClase = cc.idCatalogoClase'
      )
      .where('ct.id = :idCatalogoTipo', { idCatalogoTipo })
      .orderBy('cc.descripcion', 'ASC')
      .getMany()
  }

  async listarTiposInvestigacionBien(): Promise<S2iTipoInvestigacionBien[]> {
    return this.dataSource
      .getRepository(S2iTipoInvestigacionBien)
      .find({ order: { descripcion: 'ASC' } })
  }

  // ==================== FLUJO DE TRANSPORTE ====================

  async listarColores(): Promise<S2iColor[]> {
    return this.dataSource
      .getRepository(S2iColor)
      .find({ order: { descripcion: 'ASC' } })
  }
}
