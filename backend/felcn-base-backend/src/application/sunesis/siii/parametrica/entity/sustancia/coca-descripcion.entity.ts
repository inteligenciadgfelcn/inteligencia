import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'coca_descripcion', schema: SCHEMA_PARAMETRICAS })
export class CocaDescripcion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_coca_descripcion' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
