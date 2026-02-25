import { Entity, PrimaryColumn, Column } from 'typeorm'

/**
 * Entidad Letra
 * Base de datos: felcn_asignacion_casos
 * Tabla: letra
 */
@Entity({ name: 'letra' })
export class Letra {
  @PrimaryColumn({ name: 'codigo', type: 'char', length: 3 })
  codigo: string

  @Column({ name: 'es_mostrable', type: 'boolean' })
  esMostrable: boolean
}
