import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm'
import { Provincia } from './provincia.entity'

@Entity({ name: 'departamento' })
export class Departamento {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_departamento',
    comment: 'Clave primaria del departamento',
  })
  idDepartamento!: number

  @Column({
    name: 'id_pais',
    type: 'int',
    comment: 'Relación con país',
  })
  idPais!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Abreviatura del departamento',
  })
  abreviatura!: string

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción del departamento',
  })
  descripcion!: string

   @OneToMany(() => Provincia, (prov) => prov.departamento)
  provincias!: Provincia[]
}