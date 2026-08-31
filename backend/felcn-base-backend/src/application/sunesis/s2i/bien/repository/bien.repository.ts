import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'

import { S2iItemBienInvestigado } from '../entity/item-bien-investigado.entity'
import { S2iItemBienCaracteristica } from '../entity/item-bien-caracteristica.entity'
import { S2iLugarBien } from '../entity/lugar-bien.entity'
import { S2iArchivoBien } from '../entity/archivo-bien.entity'
import { S2aCatalogoClase } from '../../parametrica/entity/catalogo-clase.entity'
import { S2aCatalogoTipo } from '../../parametrica/entity/catalogo-tipo.entity'
import { S2aCatalogoCaracteristica } from '../../parametrica/entity/catalogo-caracteristica.entity'

@Injectable()
export class BienRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // ==================== BIENES INVESTIGADOS ====================

  async crear(bien: S2iItemBienInvestigado): Promise<S2iItemBienInvestigado> {
    return this.dataSource.getRepository(S2iItemBienInvestigado).save(bien)
  }

  async buscarPorId(
    idItemBienSecundario: string
  ): Promise<S2iItemBienInvestigado | null> {
    return this.dataSource.getRepository(S2iItemBienInvestigado).findOne({
      where: { idItemBienSecundario },
      relations: [
        'catalogoTipo',
        'catalogoTipo.catalogoClase',
        'catalogoTipo.catalogoClase.bien',
        'tipoInvestigacionBien',
      ],
    })
  }

  async listarPorCaso(idCaso: string): Promise<S2iItemBienInvestigado[]> {
    return this.dataSource.getRepository(S2iItemBienInvestigado).find({
      where: { idCaso },
      relations: [
        'catalogoTipo',
        'catalogoTipo.catalogoClase',
        'catalogoTipo.catalogoClase.bien',
        'tipoInvestigacionBien',
      ],
      order: {},
    })
  }

  async eliminar(idItemBienSecundario: string): Promise<void> {
    await this.dataSource
      .getRepository(S2iItemBienInvestigado)
      .delete(idItemBienSecundario)
  }

  // ==================== CARACTERÍSTICAS ====================

  async crearCaracteristica(
    c: S2iItemBienCaracteristica
  ): Promise<S2iItemBienCaracteristica> {
    return this.dataSource.getRepository(S2iItemBienCaracteristica).save(c)
  }

  async listarCaracteristicasPorBien(
    idItemBienSecundario: string
  ): Promise<S2iItemBienCaracteristica[]> {
    return this.dataSource.getRepository(S2iItemBienCaracteristica).find({
      where: { idItemBienSecundario },
      relations: ['catalogoCaracteristica'],
    })
  }

  async eliminarCaracteristica(
    idItemBienCaracteristica: number
  ): Promise<void> {
    await this.dataSource
      .getRepository(S2iItemBienCaracteristica)
      .delete(idItemBienCaracteristica)
  }

  /**
   * Retorna las características disponibles para el bien que contiene idItemBienSecundario.
   * Filtra por la clase del tipo de bien registrado.
   */
  async listarCaracteristicasDisponibles(
    idItemBienSecundario: string
  ): Promise<S2aCatalogoCaracteristica[]> {
    return this.dataSource
      .getRepository(S2aCatalogoCaracteristica)
      .createQueryBuilder('cc')
      .innerJoin(
        S2aCatalogoTipo,
        'ct',
        'ct.idCatalogoClase = cc.idCatalogoClase'
      )
      .innerJoin(
        S2iItemBienInvestigado,
        'ibi',
        'ibi.idCatalogoTipo = ct.id AND ibi.idItemBienSecundario = :id',
        { id: idItemBienSecundario }
      )
      .orderBy('cc.descripcion', 'ASC')
      .getMany()
  }

  // ==================== SIG ====================

  async crearLugar(lugar: S2iLugarBien): Promise<S2iLugarBien> {
    return this.dataSource.getRepository(S2iLugarBien).save(lugar)
  }

  async listarLugaresPorBien(
    idItemBienSecundario: string
  ): Promise<S2iLugarBien[]> {
    return this.dataSource
      .getRepository(S2iLugarBien)
      .find({ where: { idItemBienSecundario } })
  }

  async eliminarLugar(idLugarBien: string): Promise<void> {
    await this.dataSource.getRepository(S2iLugarBien).delete(idLugarBien)
  }

  // ==================== ARCHIVOS ====================

  async crearArchivo(archivo: S2iArchivoBien): Promise<S2iArchivoBien> {
    return this.dataSource.getRepository(S2iArchivoBien).save(archivo)
  }

  async listarArchivosPorBien(
    idItemBienSecundario: string
  ): Promise<S2iArchivoBien[]> {
    return this.dataSource.getRepository(S2iArchivoBien).find({
      select: [
        'idArchivoBien',
        'idItemBienSecundario',
        'idContenidoCaso',
        'tipo',
        'nombre',
        'nombreArchivo',
      ],
      where: { idItemBienSecundario },
      relations: ['contenidoCaso'],
    })
  }

  async buscarArchivoPorId(
    idArchivoBien: string
  ): Promise<S2iArchivoBien | null> {
    return this.dataSource
      .getRepository(S2iArchivoBien)
      .findOne({ where: { idArchivoBien } })
  }

  async eliminarArchivo(idArchivoBien: string): Promise<void> {
    await this.dataSource.getRepository(S2iArchivoBien).delete(idArchivoBien)
  }
}
