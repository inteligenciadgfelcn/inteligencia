import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iLugar } from '../entity/lugar.entity'

const MAX_RESULTADOS = 20

@Injectable()
export class LugarRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // `descripcion` es char(100): se compara con TRIM() para ignorar el relleno de espacios.
  async buscar(texto: string): Promise<S2iLugar[]> {
    return this.dataSource
      .getRepository(S2iLugar)
      .createQueryBuilder('lugar')
      .where('TRIM(lugar.descripcion) ILIKE :texto', { texto: `%${texto}%` })
      .orderBy('lugar.descripcion', 'ASC')
      .take(MAX_RESULTADOS)
      .getMany()
  }

  async buscarExacto(descripcion: string): Promise<S2iLugar | null> {
    return this.dataSource
      .getRepository(S2iLugar)
      .createQueryBuilder('lugar')
      .where('TRIM(lugar.descripcion) ILIKE :descripcion', { descripcion })
      .getOne()
  }

  async crear(lugar: S2iLugar): Promise<S2iLugar> {
    return this.dataSource.getRepository(S2iLugar).save(lugar)
  }
}
