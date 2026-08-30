import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.tipo_activo
 * Tipos de activo patrimonial — referenciado por activo_patrimonial
 */
@Entity({ name: 'tipo_activo', schema: SCHEMA_PARAMETRICAS })
export class S2iTipoActivo {
  @PrimaryColumn({ type: 'smallint', name: 'id_tipo_activo' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iTipoActivo>) {
    if (data) Object.assign(this, data)
  }
}
