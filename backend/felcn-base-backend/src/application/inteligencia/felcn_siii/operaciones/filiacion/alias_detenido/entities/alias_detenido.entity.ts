import { Profesion } from '@/application/inteligencia/felcn_siii/parametricas/profesion/entities/profesion.entity'
import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Entity,
} from 'typeorm'

@Entity({ name: 'alias_detenido', schema: 'public' })
export class AliasDetenido {
  @PrimaryGeneratedColumn({
    name: 'id_alias_detenido',
    type: 'int',
    comment: 'Clave primaria del registro',
  })
  idAliasDetenido: number

  @Column({
    name: 'id_detenido',
    type: 'int',
    nullable: true,
    comment: 'Identificador del detenido',
  })
  idDetenido: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 10,
    comment: 'descripción de alias de detenido',
  })
  descripcion: string

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

  @ManyToOne(() => Profesion, { nullable: true })
  @JoinColumn({
    name: 'id_profesion',
  })
  profesion: Profesion

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
