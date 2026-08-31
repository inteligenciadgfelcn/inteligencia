import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.color
 * Catálogo de colores usado por flujo_transporte.id_color
 */
@Entity({ name: 'color', schema: SCHEMA_PARAMETRICAS })
export class S2iColor {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id_color' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'color', type: 'varchar', length: 15 })
  color: string

  @Column({ name: 'hexadecimal', type: 'varchar', length: 10 })
  hexadecimal: string
}
