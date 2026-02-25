import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_denuncia', schema: SCHEMA_PARAMETRICAS })
export class TipoDenuncia {
  @PrimaryColumn({ type: 'integer', name: 'id_tipo_denuncia' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 30 })
  descripcion: string
}
