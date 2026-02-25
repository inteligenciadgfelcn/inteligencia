import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_documento', schema: SCHEMA_PARAMETRICAS })
export class TipoDocumento {
  @PrimaryColumn({ type: 'integer', name: 'id_tipo_documento' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
