import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'coca_estado', schema: SCHEMA_PARAMETRICAS })
export class CocaEstado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_coca_estado' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
