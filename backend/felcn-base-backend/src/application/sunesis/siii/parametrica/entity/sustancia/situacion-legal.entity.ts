import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'situacion_legal', schema: SCHEMA_PARAMETRICAS })
export class SituacionLegal {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_situacion_legal' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
