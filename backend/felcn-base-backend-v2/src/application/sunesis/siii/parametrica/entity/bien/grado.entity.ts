import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'grado', schema: SCHEMA_PARAMETRICAS })
export class Grado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_grado' })
  id: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 20 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
