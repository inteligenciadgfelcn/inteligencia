import { Entity, PrimaryColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'letra', schema: SCHEMA_PARAMETRICAS })
export class Letra {
  @PrimaryColumn({ name: 'letras', type: 'varchar', length: 3 })
  letras: string
}
