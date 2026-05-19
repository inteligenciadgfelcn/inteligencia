import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_AUTH_FDW } from '../../../../shared/constants'

@Entity({ name: 'grado', schema: SCHEMA_AUTH_FDW })
export class Grado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 20 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
