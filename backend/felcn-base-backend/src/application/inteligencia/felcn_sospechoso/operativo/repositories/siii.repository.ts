import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'

@Injectable()
export class SiiiRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) {}

  async getOperativoByCaso(numero_caso: string) {
    return await this.dataSource.query(
      `SELECT 
          a.nombre_caso, 
          a.numero_caso,
          a.asignado_caso, 
          a.fiscal_asignado_caso,
          o.fecha_operativo, 
          o.id_departamento, 
          d.descripcion as departamento, 
          o.id_provincia,
          p.descripcion as provincia, 
          o.id_localidad, 
          l.descripcion as localidad, 
          o.lugar,
          o.id_categoria_operativo,
          c.descripcion as categoria_operativo,
          o.id_item_operativo,
          i.descripcion as item_operativo, 
          o.id_unidad, 
          o.id_distrital, 
          o.id_grupo, 
          o.mando 
       FROM operativo o
       INNER JOIN asignacion a 
         ON o.numero_operativo = a.numero_operativo
       INNER JOIN parametricas.departamento d 
         ON o.id_departamento = d.id_departamento
       INNER JOIN parametricas.provincia p 
         ON o.id_provincia = p.id_provincia
       INNER JOIN parametricas.localidad l 
         ON o.id_localidad = l.id_localidad
       INNER JOIN parametricas.categoria_operativo c 
         ON o.id_categoria_operativo= c.id_categoria_operativo
       INNER JOIN public.item_operativo i 
         ON o.id_item_operativo= i.id_item_operativo
       WHERE TRIM(a.numero_caso) = $1`,
      [numero_caso]
    )
  }
}