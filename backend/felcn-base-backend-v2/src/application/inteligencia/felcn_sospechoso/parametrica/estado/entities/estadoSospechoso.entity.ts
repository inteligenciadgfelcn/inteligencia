import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm'
import { DetenidoSospechoso } from '../../../detenido/entities/detenido-sospechoso.entity'

@Entity({ name: 'estado', schema: 'public' })
export class EstadoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_estado',
    comment: 'Clave primaria del estado',
  })
  idEstado!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Descripción del estado',
  })
  descripcion!: string
}
