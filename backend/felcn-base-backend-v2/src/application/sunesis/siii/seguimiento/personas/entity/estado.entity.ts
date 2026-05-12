import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { Etapa } from '../../../parametrica/entity/operativo/etapa.entity'

/**
 * Entidad Estado
 * Estado del proceso, agrupado por etapa.
 * Origen: FRM-JUR-02.aspx.cs — ddletapa_SelectedIndexChanged / ESTADO
 * Tabla: public.estado
 */
@Entity({ name: 'estado', schema: SCHEMA_PUBLIC })
export class Estado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_estado' })
  id: number

  @Column({ name: 'id_etapa', type: 'integer' })
  idEtapa: number

  @Column({ name: 'descripcion', type: 'varchar', length: 40 })
  descripcion: string

  @ManyToOne(() => Etapa)
  @JoinColumn({ name: 'id_etapa' })
  etapa?: Etapa

  constructor(data?: Partial<Estado>) {
    if (data) Object.assign(this, data)
  }
}
