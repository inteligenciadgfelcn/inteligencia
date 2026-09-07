import { AuditableEntity } from '@/common/entity/auditable.entity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'catalogoclase',
  schema: 'parametricas',
})
export class CatalogoClaseLgi {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'catclas_id',
  })
  catClasId: number
  
  @Column({
    type: 'bigint',
    name: 'bien_id',
  })
  bienId: number

  @Column()
  descripcion: string
  
  @Column()
  fungible: boolean
}