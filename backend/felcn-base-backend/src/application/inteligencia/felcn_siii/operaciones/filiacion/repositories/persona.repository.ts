import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'

@Injectable()
export class PersonaRepository {

  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async findPersonasSinFiliar(numeroCaso: string) {
    const query = `
      SELECT
        p.id_persona_auxiliar,
        p.id_operativo,
        p.nombres,
        p.apellido_paterno,
        p.apellido_materno,
        p.apellido_esposo,
        pa.descripcion AS pais,
        p.genero,
        td.descripcion AS documento,
        p.numero_documento,
        p.fecha_nacimiento,
        p.direccion,
        p.estado,
        p.enviado
      FROM persona_auxiliar p
      INNER JOIN operativo o
        ON o.id_operativo = p.id_operativo
      INNER JOIN parametricas.pais pa
        ON pa.id_pais = p.id_pais
      INNER JOIN parametricas.tipo_documento td
        ON td.id_tipo_documento = p.id_tipo_documento
      WHERE o.numero_caso = @0
      AND p.enviado = 0
      ORDER BY 
        p.apellido_paterno,
        p.apellido_materno,
        p.nombres
    `

    return this.dataSource.query(query, [numeroCaso])
  }
}
