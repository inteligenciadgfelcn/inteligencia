import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'bienes', schema: SCHEMA_PARAMETRICAS })
export class Bienes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_bien' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
