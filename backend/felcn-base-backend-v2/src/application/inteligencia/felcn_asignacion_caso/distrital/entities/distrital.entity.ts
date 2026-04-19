import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  BeforeInsert,
} from 'typeorm'

@Entity({ name: 'distrital' })
export class Distrital {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_distrital',
    comment: 'Clave primaria del registro',
  })
  idDistrital!: number

  @Column({
    name: 'id_unidad',
  })
  unidad!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Descripción única del distrital',
  })
  descripcion!: string
}
