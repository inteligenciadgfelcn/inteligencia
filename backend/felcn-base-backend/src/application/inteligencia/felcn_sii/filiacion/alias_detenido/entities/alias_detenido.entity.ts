
import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Entity,
} from 'typeorm'
import { Detenido } from '@/application/inteligencia/felcn_sii/filiacion/detenido/entities/detenido.entity'

@Entity({ name: 'alias_detenido', schema: 'public' })
export class AliasDetenido {
  @PrimaryGeneratedColumn({
    name: 'id_alias_detenido',
    type: 'int',
    comment: 'Clave primaria del registro',
  })
  idAliasDetenido: number

  @ManyToOne(() => Detenido)
  @JoinColumn({ name: 'id_detenido' })
  detenido: Detenido

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 150,
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
    length: 15,
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
    length: 15,
    nullable: true,
    comment: 'Usuario que realizó la última actualización',
  })
  usuarioActualizacion: string
}
