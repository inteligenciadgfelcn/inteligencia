import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'color_piel', schema: SCHEMA_PARAMETRICAS })
export class ColorPiel {
  @PrimaryColumn({ type: 'integer', name: 'id_color_piel' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 30 })
  descripcion: string
}
