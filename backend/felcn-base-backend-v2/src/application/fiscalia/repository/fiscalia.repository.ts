import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'

/**
 * Repositorio FiscaliaRepository
 * Acceso genérico a las tablas de staging del schema fiscalia (felcn_siii).
 * Todas comparten el mismo patrón (pol_*_id PK, mp_*_id UNIQUE, payload
 * JSONB), por lo que un único repositorio evita 10 clases repetidas.
 */
@Injectable()
export class FiscaliaRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async crear<T extends ObjectLiteral>(
    entidad: EntityTarget<T>,
    data: DeepPartial<T>
  ): Promise<T> {
    const repo = this.dataSource.getRepository(entidad)
    return await repo.save(repo.create(data))
  }

  async buscarUno<T extends ObjectLiteral>(
    entidad: EntityTarget<T>,
    where: FindOptionsWhere<T>
  ): Promise<T | null> {
    return await this.dataSource.getRepository(entidad).findOne({ where })
  }

  async guardar<T extends ObjectLiteral>(
    entidad: EntityTarget<T>,
    data: DeepPartial<T>
  ): Promise<T> {
    return await this.dataSource.getRepository(entidad).save(data)
  }
}
