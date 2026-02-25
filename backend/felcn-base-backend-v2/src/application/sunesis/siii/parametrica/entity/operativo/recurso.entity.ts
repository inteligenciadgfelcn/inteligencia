import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'recurso', schema: SCHEMA_PARAMETRICAS })
export class Recurso {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_recurso' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 20 })
  descripcion: string
}
