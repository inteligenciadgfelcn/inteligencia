import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Distrital } from '../../distrital/entities/distrital.entity'


@Entity({ name: 'grupo' })
@Index('UQ_grupo_distrito_descripcion', ['distrital', 'descripcion'], {
  unique: true,
})
export class Grupo {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_grupo',
    comment: 'Clave primaria del registro',
  })
  idGrupo!: number

  @ManyToOne(() => Distrital, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_distrital',
  })
  distrital!: Distrital

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción del grupo',
  })
  descripcion!: string

}
