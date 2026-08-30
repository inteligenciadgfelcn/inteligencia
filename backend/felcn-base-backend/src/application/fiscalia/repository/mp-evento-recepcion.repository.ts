import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { MpEventoRecepcion } from '../entity/mp-evento-recepcion.entity'

/**
 * Repositorio MpEventoRecepcionRepository
 * Bitácora de peticiones recibidas del MP (fiscalia.mp_evento_recepcion).
 */
@Injectable()
export class MpEventoRecepcionRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async registrar(data: Partial<MpEventoRecepcion>): Promise<void> {
    await this.dataSource.getRepository(MpEventoRecepcion).save(data)
  }
}
