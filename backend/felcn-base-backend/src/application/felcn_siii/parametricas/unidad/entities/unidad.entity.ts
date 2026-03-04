import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Distrital } from '../../distrital/entities/distrital.entity'
import { Estado } from '@/application/felcn_siii/estado.enum'
import { Asignacion } from '@/application/felcn_siii/operaciones/asignaciones/entities/asignacione.entity'

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
    length: 10,
    nullable: false,
    comment: 'abreviatura única de la unidad',
  })
  abreviatura: string

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de la unidad',
  })
  descripcion: string

   @Column({
    name:'abreviatura_icia',
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Abreviatura ICIA',
  })
  abreviaturaIcia: string

  @Column({
    name: 'es_operativa_admin',
    type: 'boolean',
    default: true,
    comment: 'Indicador de operación administrativa',
  })
  es_operativa_admin: boolean

  @Column({
    name:'abreviatura_reporte',
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'abreviatura de reporte',
  })
  abreviaturaReporte: string

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

  @OneToMany(() => Asignacion, (asignacion) => asignacion.unidad)
  asignaciones: Asignacion[]
}
