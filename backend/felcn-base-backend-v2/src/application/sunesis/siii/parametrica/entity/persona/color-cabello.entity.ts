import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'color_cabello', schema: SCHEMA_PARAMETRICAS })
export class ColorCabello {
  @PrimaryColumn({ type: 'integer', name: 'id_color_cabello' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 30 })
  descripcion: string
}
