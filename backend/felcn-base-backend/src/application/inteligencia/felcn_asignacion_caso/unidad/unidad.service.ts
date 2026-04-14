import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_AUTH } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'

@Injectable()
export class UnidadService {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  async findAllGeneral() {
    return this.dataSource.query(`
    SELECT 
      unidad.id,
      unidad.descripcion,
      unidad.abreviatura,
      json_agg(
        json_build_object(
          'idDistrital', distrital.id,
          'descripcion', distrital.descripcion
        )
      ) AS distritos
    FROM parametro.unidad
    INNER JOIN parametro.distrital 
      ON distrital.id_unidad = unidad.id
    WHERE unidad._estado = 'ACTIVO'
    GROUP BY unidad.id, unidad.descripcion, unidad.abreviatura
  `)
  }
}
