import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Letra } from '../../letra/entities/letra.entity'
import { Servicio } from '../../servicio/entities/servicio.entity'
import { Departamento } from '../../departamento/entities/departamento.entity'
import { Unidad } from '../../unidad/entities/unidad.entity'

@Entity({ name: 'asignacion', schema: 'public' })
export class AsignacionASIG {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_asignacion',
    comment: 'Clave primaria del registro',
  })
  idAsignacion!: number

  @Column({ name: 'id_departamento' })
  idDepartamento!: string

  @Column({ name: 'id_unidad' })
  idUnidad!: number

  @Column({
    name: 'codigo_letra',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Iniciales del principal aprendido',
  })
  codigoLetra!: string

  @Column({
    name: 'numero_caso',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso generado por departamento y letra por gestión',
  })
  nroCaso!: string

  @Column({
    name: 'numero_operativo',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment:
      'Número único de operativo generado por departamento y unidad por gestión',
  })
  nroOperativo!: string

  @Column({
    name: 'fecha_operativo',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha del operativo',
  })
  fechaOperativo!: Date

  @Column({
    name: 'nombre_caso',
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Nombre descriptivo del caso',
  })
  nombreCaso!: string

  @Column({
    name: 'asignacion_caso',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Nombre del solicitante',
  })
  nombreSolicitud!: string

  @Column({
    name: 'codigo_servicio',
    type: 'varchar',
    comment: 'Código interno del servicio asociado a la asignación',
  })
  codigoServicio!: string

  @Column({
    name: 'fiscal_asignado',
    type: 'varchar',
    length: 150,
    comment: 'Nombre del fiscal asignado al caso',
  })
  fiscalAsignado!: string

  @Column({
    name: 'id_caso_siii',
    type: 'int',
    nullable: true,
  })
  idCasoSiii!: number

  @Column({
    name: 'fecha_hora_registro',
    type: 'timestamptz',
    nullable: true,
    comment: 'Fecha en la que se realizó la solicitud',
  })
  fechaSolicitud!: Date

  @Column({
    name: 'usuario_login',
    type: 'varchar',
    nullable: true,
    comment: 'Nro de pase de usuario',
  })
  usuario!: string

  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'id_departamento' })
  departamento!: Departamento

  @ManyToOne(() => Unidad)
  @JoinColumn({ name: 'id_unidad' })
  unidad!: Unidad

  @ManyToOne(() => Letra)
  @JoinColumn({ name: 'codigo_letra' })
  letra!: Letra

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'codigo_servicio' })
  servicio!: Servicio
}
