
import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'departamento',
})
export class Departamento {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_departamento',
    comment: 'Clave primaria del registro',
  })
  idDepartamento!: number

  @Index(['descripcion'], { unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  descripcion!: string
}
