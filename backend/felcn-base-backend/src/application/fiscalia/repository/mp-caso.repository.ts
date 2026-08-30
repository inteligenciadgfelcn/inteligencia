import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { MpCaso } from '../entity/mp-caso.entity'

/**
 * Repositorio MpCasoRepository
 * Acceso a la tabla de staging fiscalia.mp_caso (felcn_siii).
 */
@Injectable()
export class MpCasoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async crear(data: Partial<MpCaso>): Promise<MpCaso> {
    return await this.dataSource.getRepository(MpCaso).save(data)
  }

  async buscarPorMpCasoId(mpCasoId: number): Promise<MpCaso | null> {
    return await this.dataSource
      .getRepository(MpCaso)
      .findOne({ where: { mpCasoId: String(mpCasoId) } })
  }

  async buscarPorPolCasoId(polCasoId: string): Promise<MpCaso | null> {
    return await this.dataSource
      .getRepository(MpCaso)
      .findOne({ where: { polCasoId } })
  }

  async actualizar(polCasoId: string, update: Partial<MpCaso>): Promise<void> {
    await this.dataSource
      .getRepository(MpCaso)
      .save({ polCasoId, ...update, updatedAt: new Date() })
  }
}
