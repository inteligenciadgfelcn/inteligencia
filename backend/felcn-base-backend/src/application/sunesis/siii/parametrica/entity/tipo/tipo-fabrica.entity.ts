import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_fabrica', schema: SCHEMA_PARAMETRICAS })
export class TipoFabrica {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_fabrica' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 35 })
  descripcion: string
}
