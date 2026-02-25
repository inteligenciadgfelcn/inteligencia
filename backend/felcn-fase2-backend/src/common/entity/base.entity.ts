import {
  PrimaryGeneratedColumn,
} from 'typeorm'

export abstract class BaseEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'Clave primaria del registro',
  })
  id: number

  constructor(data?: Partial<BaseEntity>) {
    Object.assign(this, data)
  }
}
