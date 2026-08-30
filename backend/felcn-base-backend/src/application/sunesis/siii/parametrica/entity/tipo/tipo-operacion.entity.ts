import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_operacion', schema: SCHEMA_PARAMETRICAS })
export class TipoOperacion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_operacion' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
