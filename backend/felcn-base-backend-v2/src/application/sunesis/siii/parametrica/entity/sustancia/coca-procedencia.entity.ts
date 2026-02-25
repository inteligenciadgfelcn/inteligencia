import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'coca_procedencia', schema: SCHEMA_PARAMETRICAS })
export class CocaProcedencia {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_coca_procedencia' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
