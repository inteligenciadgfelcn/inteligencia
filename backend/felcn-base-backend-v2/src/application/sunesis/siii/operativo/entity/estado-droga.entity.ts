import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad Estado Droga
 * Estados de la droga según tipo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: estado_droga
 */
@Entity({ name: 'estado_droga', schema: SCHEMA_PUBLIC })
export class EstadoDroga {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_estado_droga' })
  id: number

  @Column({ name: 'id_tipo_droga', type: 'integer' })
  idTipoDroga: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<EstadoDroga>) {
    if (data) Object.assign(this, data)
  }
}
