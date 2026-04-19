import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  OneToMany,
} from 'typeorm'
import { ItemOperativo } from '../../item_operativo/entities/item_operativo.entity'

@Entity({ name: 'categoria_operativo' })
export class CategoriaOperativo {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_categoria_operativo',
    comment: 'Clave primaria de la categoría de operativo',
  })
  idCategoriaOperativo!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción de la categoría de operativo',
  })
  descripcion!: string

  @OneToMany(
    () => ItemOperativo,
    (item) => item.categoria
  )
  items!: ItemOperativo[]
}