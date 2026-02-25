import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { Grado } from '../entity/grado.entity'
import { Unidad } from '../entity/unidad.entity'
import { Distrital } from '../entity/distrital.entity'
import { Grupo } from '../entity/grupo.entity'

@Injectable()
export class EstructuraRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource,
  ) {}

  // Grados
  async listarGrados(): Promise<Grado[]> {
    return this.dataSource
      .getRepository(Grado)
      .createQueryBuilder('grado')
      .orderBy('grado.descripcion', 'ASC')
      .getMany()
  }

  // Unidades
  async listarUnidades(): Promise<Unidad[]> {
    return this.dataSource
      .getRepository(Unidad)
      .createQueryBuilder('unidad')
      .orderBy('unidad.descripcion', 'ASC')
      .getMany()
  }

  // Distritales
  async listarDistritales(): Promise<Distrital[]> {
    return this.dataSource
      .getRepository(Distrital)
      .createQueryBuilder('distrital')
      .leftJoinAndSelect('distrital.unidad', 'unidad')
      .orderBy('distrital.descripcion', 'ASC')
      .getMany()
  }

  async listarDistritalesPorUnidad(idUnidad: number): Promise<Distrital[]> {
    return this.dataSource
      .getRepository(Distrital)
      .createQueryBuilder('distrital')
      .leftJoinAndSelect('distrital.unidad', 'unidad')
      .where('distrital.idUnidad = :idUnidad', { idUnidad })
      .orderBy('distrital.descripcion', 'ASC')
      .getMany()
  }

  // Grupos
  async listarGrupos(): Promise<Grupo[]> {
    return this.dataSource
      .getRepository(Grupo)
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.distrital', 'distrital')
      .orderBy('grupo.descripcion', 'ASC')
      .getMany()
  }

  async listarGruposPorDistrital(idDistrital: number): Promise<Grupo[]> {
    return this.dataSource
      .getRepository(Grupo)
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.distrital', 'distrital')
      .where('grupo.idDistrital = :idDistrital', { idDistrital })
      .orderBy('grupo.descripcion', 'ASC')
      .getMany()
  }
}
