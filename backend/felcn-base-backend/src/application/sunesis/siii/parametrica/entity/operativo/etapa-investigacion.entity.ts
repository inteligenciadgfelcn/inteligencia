import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'etapa_investigacion', schema: SCHEMA_PARAMETRICAS })
export class EtapaInvestigacion {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_etapa_investigacion' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
