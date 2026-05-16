import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'etapa', schema: SCHEMA_PARAMETRICAS })
export class EtapaOperativo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_etapa' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 15 })
  descripcion: string
}
