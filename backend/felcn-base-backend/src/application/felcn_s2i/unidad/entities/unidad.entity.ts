import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Distrital } from '../../distrital/entities/distrital.entity'
import { Estado } from '../../estado.enum'

@Entity({ name: 'unidad' })
export class Unidad {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_unidad',
    comment: 'Clave primaria del registro',
  })
  idUnidad: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Código único de la unidad',
  })
  abreviatura: string

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Descripción de la unidad',
  })
  descripcion: string

  @Column({
    name: 'es_operativa_admin',
    type: 'boolean',
    default: false,
    comment: 'Indicador de operación administrativa',
  })
  es_operativa_admin: boolean

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
    comment: 'Estado del registro',
  })
  estado: Estado

  @BeforeInsert()
  setEstadoPorDefecto() {
    if (!this.estado) {
      this.estado = Estado.ACTIVO
    }
  }

  @OneToMany(() => Distrital, (distrital) => distrital.unidad)
  distritales: Distrital[]
}
