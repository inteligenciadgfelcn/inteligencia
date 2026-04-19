import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { CategoriaOperativo } from '../../categoria_operativo/entities/categoria_operativo.entity'

@Entity({ name: 'item_operativo' })
export class ItemOperativo {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_item_operativo',
    comment: 'Clave primaria del item operativo',
  })
  idItemOperativo!: number

  @Column({
    name: 'id_categoria_operativo',
    type: 'int',
    comment: 'Relación con categoria_operativo',
  })
  idCategoriaOperativo!: number

  @Index()
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción del item operativo',
  })
  descripcion!: string

  @ManyToOne(
    () => CategoriaOperativo,
    (categoria) => categoria.items
  )
  @JoinColumn({ name: 'id_categoria_operativo' })
  categoria!: CategoriaOperativo
}