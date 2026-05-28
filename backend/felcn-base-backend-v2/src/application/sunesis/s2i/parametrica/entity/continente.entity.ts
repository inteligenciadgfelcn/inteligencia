import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.continente
 * Catálogo de continentes geográficos
 */
@Entity({ name: 'continente', schema: SCHEMA_PARAMETRICAS })
export class S2iContinente {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_continente' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iContinente>) {
    if (data) Object.assign(this, data)
  }
}
