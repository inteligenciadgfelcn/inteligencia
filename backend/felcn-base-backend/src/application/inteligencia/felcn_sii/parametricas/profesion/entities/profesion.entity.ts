import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'

@Entity({ schema: 'parametricas', name: 'profesion' })
export class Profesion {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_profesion',
    comment: 'Clave primaria del registro',
  })
  idProfesion: number

  @Column({
    type: 'varchar',
    length: 70,
    nullable: false,
    comment: 'Descripción de la profesión',
  })
  descripcion: string

  @Column({
    name: 'ocupa_profesion',
    type: 'boolean',
    default: true,
    comment: 'Indica si la profesión está habilitada',
  })
  ocupaProfesion: boolean
}
