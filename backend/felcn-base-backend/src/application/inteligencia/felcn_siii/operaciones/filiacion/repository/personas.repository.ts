import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_SIII } from '@/core/config/database/database.module'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class PersonasRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly datasource: DataSource
  ) {}

  async obtenerPersonasPorCaso(
  nroCaso: string,
  filiado: number,
  pagination: PaginacionQueryDto
): Promise<[any[], number]> {

  const { limite, saltar, filtro } = pagination || { limite: 10, saltar: 0 }

   const baseQuery = this.datasource
      .createQueryBuilder()
      .from('persona_auxiliar', 'p')
      .leftJoin('operativo', 'o', 'p.id_operativo = o.id_operativo')
      .leftJoin('pais', 'pa', 'p.id_pais = pa.id_pais')
      .leftJoin('tipo_documento', 'td', 'p.id_tipo_documento = td.id_tipo_documento')
      .leftJoin('asignacion', 'a', 'o.numero_operativo = a.numero_operativo')
      .where('TRIM(a.numero_caso) = :caso', { caso: nroCaso.trim() })
      .andWhere('p.enviado = :enviado', { enviado: filiado })

    if (filtro) {
      baseQuery.andWhere(
        `(p.nombres ILIKE :filtro
          OR p.apellido_paterno ILIKE :filtro
          OR p.numero_documento ILIKE :filtro)`,
        { filtro: `%${filtro}%` }
      )
    }

  const filas = await baseQuery
    .clone()
    .select([
      'p.id_persona_auxiliar AS id_persona_auxiliar',
      'p.nombres AS nombres',
      'p.apellido_paterno AS apellido_paterno',
      'p.apellido_materno AS apellido_materno',
      'p.apellido_esposo AS apellido_esposo',
      'pa.descripcion AS pais',
      `CASE WHEN p.genero = 1 THEN 'Masculino' ELSE 'Femenino' END AS genero`,
      'td.descripcion AS tipo_documento',
      'p.numero_documento AS numero_documento',
      `TO_CHAR(p.fecha_nacimiento,'DD/MM/YYYY') AS fecha_nacimiento`,
      'o.id_operativo',
      'o.lugar AS lugar',
      'a.numero_caso',
      'p.direccion AS direccion',
      'p.estado AS estado',
      'p.enviado AS enviado'
    ])
    .take(limite)
    .skip(saltar)
    .getRawMany()

  const total = (await baseQuery.clone().getRawMany()).length


  return [filas, total]
}

async obtenerPersona(id: number) {

  return this.datasource
    .createQueryBuilder()
    .from('persona_auxiliar', 'p')
    .leftJoin('operativo', 'o', 'p.id_operativo = o.id_operativo')
    .leftJoin('pais', 'pa', 'p.id_pais = pa.id_pais')
    .leftJoin('tipo_documento', 'td', 'p.id_tipo_documento = td.id_tipo_documento')
    .select([
      'p.id_persona_auxiliar AS id_persona_auxiliar',
      'p.nombres AS nombres',
      'p.apellido_paterno AS apellido_paterno',
      'p.apellido_materno AS apellido_materno',
      'p.apellido_esposo AS apellido_esposo',
      'pa.descripcion AS pais',
      `CASE WHEN p.genero = 1 THEN 'Masculino' ELSE 'Femenino' END AS genero`,
      'td.descripcion AS tipo_documento',
      'p.numero_documento AS numero_documento',
      `TO_CHAR(p.fecha_nacimiento,'DD/MM/YYYY') AS fecha_nacimiento`,
      'o.lugar AS lugar_operativo',
      'p.direccion AS direccion',
      'p.estado AS estado',
      'p.enviado AS enviado'
    ])
    .where('p.id_persona_auxiliar = :id', { id })
    .getRawOne()
}
}
