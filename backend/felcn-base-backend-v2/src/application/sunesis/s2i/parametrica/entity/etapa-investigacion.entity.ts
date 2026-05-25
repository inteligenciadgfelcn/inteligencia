import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.etapa_investigacion
 * Etapas del proceso de investigación (sin identidad, PK manual)
 */
@Entity({ name: 'etapa_investigacion', schema: SCHEMA_PARAMETRICAS })
export class S2iEtapaInvestigacion {
  @PrimaryColumn({ type: 'integer', name: 'id_etapa_investigacion' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iEtapaInvestigacion>) {
    if (data) Object.assign(this, data)
  }
}
