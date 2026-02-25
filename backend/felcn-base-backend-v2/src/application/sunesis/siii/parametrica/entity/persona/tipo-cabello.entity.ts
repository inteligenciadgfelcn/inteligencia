import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_cabellos', schema: SCHEMA_PARAMETRICAS })
export class TipoCabello {
  @PrimaryColumn({ type: 'integer', name: 'id_tipo_cabello' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
