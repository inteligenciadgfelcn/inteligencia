import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Entity,
} from 'typeorm'
import { Detenido } from '../../detenido/entities/detenido.entity'
import { Profesion } from '@/application/inteligencia/felcn_siii/parametricas/profesion/entities/profesion.entity'

@Entity({ name: 'profesion_detenido', schema: 'public' })
export class ProfesionDetenido {
  @PrimaryGeneratedColumn({
    name: 'id_profesion_detenido',
    type: 'int',
    comment: 'Clave primaria del registro',
  })
  idProfesionDetenido: number

  @ManyToOne(() => Detenido)
  @JoinColumn({ name: 'id_detenido' })
  detenido: Detenido

  @ManyToOne(() => Profesion)
  @JoinColumn({ name: 'id_profesion' })
  idProfesion: Profesion

  @Column({
    name: 'fecha_hora_ingreso',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha y hora de ingreso del registro',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Usuario que registró la información',
  })
  usuario: string

  @Column({
    name: 'fecha_hora_actualizacion',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha y hora de última actualización',
  })
  fechaHoraActualizacion: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Usuario que realizó la última actualización',
  })
  usuarioActualizacion: string
}
