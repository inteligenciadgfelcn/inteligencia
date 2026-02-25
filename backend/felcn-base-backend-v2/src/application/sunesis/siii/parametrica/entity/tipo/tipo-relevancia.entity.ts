import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_relevancia', schema: SCHEMA_PARAMETRICAS })
export class TipoRelevancia {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_relevancia' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
