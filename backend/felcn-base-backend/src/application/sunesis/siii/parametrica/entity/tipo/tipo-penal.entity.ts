import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_penal', schema: SCHEMA_PARAMETRICAS })
export class TipoPenal {
  @PrimaryColumn({ type: 'integer', name: 'id_tipo_penal' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
