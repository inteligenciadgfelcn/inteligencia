import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.tipo_organizacion
 * Tipos de organización empresarial investigada
 */
@Entity({ name: 'tipo_organizacion', schema: SCHEMA_PARAMETRICAS })
export class S2iTipoOrganizacion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_organizacion' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iTipoOrganizacion>) {
    if (data) Object.assign(this, data)
  }
}
