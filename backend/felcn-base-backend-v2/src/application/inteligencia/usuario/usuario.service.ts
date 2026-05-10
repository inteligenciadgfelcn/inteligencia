import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_AUTH } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) { }

  private baseQuery = `
    SELECT 
      u.id as "idUsuario",
      TRIM(CONCAT(
        gr.abreviatura, ' ',
        p.nombres, ' ',
        p.primer_apellido, ' ',
        COALESCE(p.segundo_apellido, '')
      )) as "nombreCompleto",
      p.nro_documento as "nroDocumento",
      p.telefono as "telefono",
      u.usuario as "usuario",
      u.numero_pase as "numeroPase",
      u._estado as "estado",
      gr.descripcion as "grado",
      g.descripcion as "grupo",
      d.descripcion as "distrital",
      un.descripcion as "unidad"
    FROM usuario.usuario u
    INNER JOIN usuario.persona p ON u.id_persona = p.id
    INNER JOIN parametro.grupo g ON u.id_grupo = g.id
    INNER JOIN parametro.distrital d ON g.id_distrital = d.id
    INNER JOIN parametro.unidad un ON d.id_unidad = un.id
    INNER JOIN parametro.grado gr ON u.id_grado = gr.id
    WHERE u._estado = 'ACTIVO'
  `
  private buildQuery(extraWhere: string) {
    return this.baseQuery + ' ' + extraWhere
  }

  async findByGrupo(id: number) {
    return this.dataSource.query(
      this.buildQuery(`AND u.id_grupo = $1`),
      [id]
    )
  }

  async findByDistrito(id: number) {
    return this.dataSource.query(
      this.buildQuery(`AND d.id = $1`),
      [id]
    )
  }

  async findByUnidad(unidadId: number) {
    return this.dataSource.query(
      this.buildQuery(`AND un.id = $1`),
      [unidadId]
    )
  }

  async findByUnidadInteligencia() {
    return this.dataSource.query(
      this.buildQuery(`AND un.abreviatura = 'DNI'`)
    )
  }

  async findOne(usuario: string) {
    const result = await this.dataSource.query(
      this.buildQuery(`AND u.numero_pase = $1`),
      [usuario]
    )

    if (!result.length) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return result[0]
  }

  async findByUnidadAbreviatura(abreviatura: string) {
    return this.dataSource.query(
      this.buildQuery(`AND un.abreviatura = $1`),
      [abreviatura]
    )
  }
}