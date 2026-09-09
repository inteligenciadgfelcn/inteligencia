import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'calidad_bien', schema: SCHEMA_PARAMETRICAS })
export class CalidadBien {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_calidad_bien' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
