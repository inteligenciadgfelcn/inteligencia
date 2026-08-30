import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'estado_civil', schema: SCHEMA_PARAMETRICAS })
export class EstadoCivil {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_estado_civil' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 25 })
  descripcion: string
}
