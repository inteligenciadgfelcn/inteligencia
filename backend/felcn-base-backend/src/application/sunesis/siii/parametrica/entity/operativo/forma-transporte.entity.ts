import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'forma_transporte', schema: SCHEMA_PARAMETRICAS })
export class FormaTransporte {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_forma_transporte' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
