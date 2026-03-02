import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Unidad } from '../../unidad/entities/unidad.entity'
import { Grupo } from '../../grupo/entities/grupo.entity'
import { Estado } from '../../estado.enum'

@Entity({ name: 'distrital' })
export class Distrital {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_distrital',
    comment: 'Clave primaria del registro',
  })
  idDistrital: number

  @ManyToOne(() => Unidad, (unidad) => unidad.distritales, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_unidad',
  })
  unidad: Unidad

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Descripción única del distrital',
  })
  descripcion: string

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

  @OneToMany(() => Grupo, (grupo) => grupo.distrital)
  grupos: Grupo[]
}
