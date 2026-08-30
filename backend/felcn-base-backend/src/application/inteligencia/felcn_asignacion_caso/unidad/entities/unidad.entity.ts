import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm'
import { AsignacionASIG } from '../../asignaciones/entities/asignacionAsig.entity'

@Entity({ name: 'unidad' })
export class Unidad {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_unidad',
    comment: 'Clave primaria del registro',
  })
  idUnidad!: string

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de la unidad',
  })
  descripcion!: string

  @OneToMany(() => AsignacionASIG, (asignacion) => asignacion.unidad)
  asignaciones!: AsignacionASIG[]
}
