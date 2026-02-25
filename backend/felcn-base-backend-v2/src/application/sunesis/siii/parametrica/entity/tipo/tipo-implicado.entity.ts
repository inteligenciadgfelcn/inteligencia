import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_implicado', schema: SCHEMA_PARAMETRICAS })
export class TipoImplicado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_implicado' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
