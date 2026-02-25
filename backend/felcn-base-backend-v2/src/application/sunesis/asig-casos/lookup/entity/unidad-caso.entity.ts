import { Entity, PrimaryColumn, Column } from 'typeorm'

/**
 * Entidad UnidadCaso
 * Base de datos: felcn_asignacion_casos
 * Tabla: unidad
 */
@Entity({ name: 'unidad' })
export class UnidadCaso {
  @PrimaryColumn({ name: 'id_unidad', type: 'char', length: 2 })
  idUnidad: string

  @Column({ name: 'descripcion', type: 'varchar', length: 80 })
  descripcion: string
}
