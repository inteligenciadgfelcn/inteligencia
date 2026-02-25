import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad Unidad
 * Base de datos: felcn_s3i
 * Tabla: unidad
 */
@Entity({ name: 'unidad' })
export class Unidad {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_unidad' })
  id: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 10 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string

  @Column({ name: 'es_operativa_admin', type: 'boolean' })
  esOperativaAdmin: boolean
}
