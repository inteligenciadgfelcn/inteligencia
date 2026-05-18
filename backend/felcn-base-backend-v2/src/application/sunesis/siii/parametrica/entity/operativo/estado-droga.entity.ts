import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { TipoDroga } from '../tipo/tipo-droga.entity'

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

  @ManyToOne(() => TipoDroga)
  @JoinColumn({ name: 'id_tipo_droga' })
  tipoDroga?: TipoDroga

  constructor(data?: Partial<EstadoDroga>) {
    if (data) Object.assign(this, data)
  }
}
