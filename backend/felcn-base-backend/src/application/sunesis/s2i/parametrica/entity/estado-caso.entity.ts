import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.estado_caso
 * Estados posibles de un caso de investigación
 */
@Entity({ name: 'estado_caso', schema: SCHEMA_PARAMETRICAS })
export class S2iEstadoCaso {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_estado_caso' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iEstadoCaso>) {
    if (data) Object.assign(this, data)
  }
}
