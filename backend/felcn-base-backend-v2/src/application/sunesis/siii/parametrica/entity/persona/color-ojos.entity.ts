import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'color_ojos', schema: SCHEMA_PARAMETRICAS })
export class ColorOjos {
  @PrimaryColumn({ type: 'integer', name: 'id_color_ojos' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
