import { Detenido } from '@/application/inteligencia/felcn_sii/filiacion/detenido/entities/detenido.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { Parentezco } from '../../parametricas/parentezco/entities/parentezco.entity'

@Entity({
  name: 'datos_familiares',
  schema: 'public',
})
export class DatosFamiliares {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_datos_familiares',
    comment: 'Clave primaria del registro',
  })
  idDatosFamiliares: number

  @ManyToOne(() => Detenido, (detenido) => detenido.datosFamiliares, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_detenido' })
  detenido: Detenido

  @Index()
  @ManyToOne(() => Parentezco, (p) => p.datosFamiliares)
  @JoinColumn({ name: 'id_parentezco' })
  parentezco: Parentezco

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
    type: 'int',
    nullable: true,
    comment: 'Edad del familiar',
  })
  edad: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Dirección',
  })
  direccion: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'telefono',
    comment: 'Teléfono o ubicación',
  })
  telefono: string

  @Column({
    type: 'boolean',
    nullable: true,
    comment: 'Indica si está vivo',
  })
  vivo: boolean

  @Column({
    type: 'boolean',
    nullable: true,
    comment: 'Indica si está implicado',
  })
  implicado: boolean

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
    name: 'fecha_actualizacion',
    nullable: true,
    comment: 'Fecha de actualización',
  })
  fechaActualizacion: Date

  @Column({
     
    type: 'varchar',
    length: 50,
    name: 'usuario_actualizado',
    nullable: true,
    comment: 'Usuario que actualizó',
  })
  usuarioActualizado: string
}
