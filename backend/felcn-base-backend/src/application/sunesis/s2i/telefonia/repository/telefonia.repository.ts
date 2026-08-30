import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iTelefono } from '../entity/telefono.entity'

@Injectable()
export class TelefoniaRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // ==================== TELÉFONOS ====================

  async crearTelefono(telefono: S2iTelefono): Promise<S2iTelefono> {
    return this.dataSource.getRepository(S2iTelefono).save(telefono)
  }

  async buscarTelefonoPorId(idTelefono: string): Promise<S2iTelefono | null> {
    return this.dataSource
      .getRepository(S2iTelefono)
      .findOne({ where: { idTelefono } })
  }

  async listarTelefonosPorCaso(idCaso: string): Promise<S2iTelefono[]> {
    return this.dataSource
      .getRepository(S2iTelefono)
      .find({ where: { idCaso } })
  }

  async eliminarTelefono(idTelefono: string): Promise<void> {
    await this.dataSource.getRepository(S2iTelefono).delete(idTelefono)
  }
}
