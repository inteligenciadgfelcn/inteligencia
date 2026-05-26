import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.bien
 * Catálogo de bienes (nivel 1 de la jerarquía bien → clase → tipo)
 */
@Entity({ name: 'bien', schema: SCHEMA_PARAMETRICAS })
export class S2iBien {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_bien' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'archivo', type: 'varchar', length: 150, nullable: true })
  archivo?: string

  constructor(data?: Partial<S2iBien>) {
    if (data) Object.assign(this, data)
  }
}
