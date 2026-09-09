import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.tipo_investigacion_bien
 * Tipos de investigación aplicados sobre un bien (ej. secuestrado, decomisado)
 */
@Entity({ name: 'tipo_investigacion_bien', schema: SCHEMA_PARAMETRICAS })
export class S2iTipoInvestigacionBien {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id_tipo_investigacion_bien',
  })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  constructor(data?: Partial<S2iTipoInvestigacionBien>) {
    if (data) Object.assign(this, data)
  }
}
