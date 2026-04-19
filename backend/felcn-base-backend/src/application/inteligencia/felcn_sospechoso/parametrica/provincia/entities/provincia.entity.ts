import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { Localidad } from '../../localidad/entities/localidad.entity'
import { Departamento } from './departamento.entity'

@Entity({ name: 'provincia' })
export class Provincia {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_provincia',
    comment: 'Clave primaria de la provincia',
  })
  idProvincia!: number

  @Column({
    name: 'id_departamento',
    type: 'int',
    comment: 'Relación con departamento',
  })
  idDepartamento!: number

  @Index()
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción de la provincia',
  })
  descripcion!: string

  @ManyToOne(() => Departamento, (dep) => dep.provincias)
  @JoinColumn({ name: 'id_departamento' })
  departamento!: Departamento

  @OneToMany(() => Localidad, (loc) => loc.provincia)
  localidades!: Localidad[]
}
