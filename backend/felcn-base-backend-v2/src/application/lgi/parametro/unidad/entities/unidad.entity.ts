import { AuditableEntity } from '@/common/entity/auditable.entity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'unidades',
  schema: 'public',
})
export class UnidadLgi extends AuditableEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'uni_id',
  })
  uniId: number

  @Column({
    type: 'char',
    length: 3,
    name: 'uni_abrev',
  })
  uniAbrev: string

  @Column({
    type: 'varchar',
    length: 80,
    name: 'uni_descripcion',
  })
  uniDescripcion: string

  @Column({
    type: 'boolean',
    name: 'uni_opadm',
    default: false,
  })
  uniOpadm: boolean
}