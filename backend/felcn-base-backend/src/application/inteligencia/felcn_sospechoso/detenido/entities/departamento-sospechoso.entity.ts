import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PaisSospechoso } from './pais-sospechoso.entity'

@Entity({
  name: 'departamento',
  schema: 'public',
})
export class DepartamentoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_departamento',
    comment: 'Clave primaria del registro',
  })
  idDepartamento!: number

  @Index({ unique: true })
  @Column({
    name: 'abreviatura',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: 'Abreviatura del departamento',
  })
  abreviatura!: string

  @Index(['pais'], { unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  descripcion!: string

  @ManyToOne(() => PaisSospechoso, { nullable: false })
  @JoinColumn({ name: 'id_pais' })
  pais!: PaisSospechoso
}
