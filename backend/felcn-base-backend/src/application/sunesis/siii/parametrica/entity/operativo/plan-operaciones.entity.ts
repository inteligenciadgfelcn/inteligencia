import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'plan_operaciones', schema: SCHEMA_PARAMETRICAS })
export class PlanOperaciones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_plan_operacion' })
  id: number

  @Column({ name: 'nombre', type: 'varchar', length: 50 })
  nombre: string

  @Column({ name: 'gestion', type: 'varchar', length: 4 })
  gestion: string
}
