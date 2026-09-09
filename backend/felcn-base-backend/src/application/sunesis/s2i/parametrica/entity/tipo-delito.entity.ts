import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.tipo_delito
 * Tipos de delito — referenciado por antecedente_blanco
 */
@Entity({ name: 'tipo_delito', schema: SCHEMA_PARAMETRICAS })
export class S2iTipoDelito {
  @PrimaryColumn({ type: 'integer', name: 'id_tipo_delito' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iTipoDelito>) {
    if (data) Object.assign(this, data)
  }
}
