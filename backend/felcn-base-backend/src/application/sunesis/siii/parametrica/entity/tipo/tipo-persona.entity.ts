import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_persona', schema: SCHEMA_PARAMETRICAS })
export class TipoPersona {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_persona' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
