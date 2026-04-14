import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { Detenido } from '../../filiacion/detenido/entities/detenido.entity'

@Entity({
  name: 'nombres_supuestos',
  schema: 'public',
})
export class NombresSupuesto {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_nombre_supuesto',
    comment: 'Clave primaria del registro',
  })
  idNombresSupuestos: number

  @ManyToOne(() => Detenido, (detenido) => detenido.nombresSupuestos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_detenido' })
  detenido: Detenido

  @Column({
    type: 'varchar',
    name: 'nombres',
    length: 150,
    nullable: false,
    comment: 'Nombres del familiar',
  })
  nombres: string

  @Column({
    type: 'varchar',
    name: 'apellido_paterno',
    length: 100,
    nullable: true,
    comment: 'Apellido paterno',
  })
  paterno: string

  @Column({
    type: 'varchar',
    name: 'apellido_materno',
    length: 100,
    nullable: true,
    comment: 'Apellido materno',
  })
  materno: string

  @Column({
    type: 'varchar',
    name: 'apellido_esposo',
    length: 100,
    nullable: true,
    comment: 'Apellido del esposo',
  })
  apellidoEsposo: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'CPQ',
  })
  cpq: string

  @Column({
    type: 'timestamp',
    name: 'fecha_hora_ingreso',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha y hora de ingreso',
  })
  fechaHoraIngreso: Date

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Usuario que registró',
  })
  usuario: string

  @Column({
    type: 'timestamp',
    name: 'fecha_hora_actualizacion',
    nullable: true,
    comment: 'Fecha de actualización',
  })
  fechaActualizacion: Date

  @Column({
    type: 'varchar',
    name: 'usuario_actualizacion',
    length: 50,
    nullable: true,
    comment: 'Usuario que registró',
  })
  usuarioActualizacion: string
}
