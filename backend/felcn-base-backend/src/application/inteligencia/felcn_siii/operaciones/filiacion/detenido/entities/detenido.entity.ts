
import { EstadoCivil } from '@/application/inteligencia/felcn_siii/parametricas/estado_civil/entities/estado_civil.entity'
import { Pais } from '@/application/inteligencia/felcn_siii/parametricas/pais/entities/pais.entity'
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm'

@Entity({ name: 'detenido', schema: 'public' })
export class Detenido {
  @PrimaryGeneratedColumn({
    name: 'id_detenido',
    type: 'int',
    comment: 'Clave primaria del registro de filiación del detenido',
  })
  idDetenido: number

  @Column({
    name: 'id_operativo',
    type: 'int',
    nullable: true,
    comment: 'Identificador del operativo relacionado',
  })
  idOperativo: number

  @Column({
    name: 'numero_caso',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso asociado',
  })
  numeroCaso: string

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 150,
    comment: 'Nombres del detenido',
  })
  nombres: string

  @Column({
    name: 'apellido_paterno',
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Apellido paterno del detenido',
  })
  apellidoPaterno: string

  @Column({
    name: 'apellido_materno',
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Apellido materno del detenido',
  })
  apellidoMaterno: string

  @Column({
    name: 'apellido_esposo',
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Apellido de esposo en caso de corresponder',
  })
  apellidoEsposo: string

  @ManyToOne(() => Pais)
  @JoinColumn({
    name: 'id_pais',
  })
  pais: Pais

  @Column({
    name: 'genero',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si el detenido es de sexo masculino',
  })
  genero: boolean

  @Column({
    name: 'fecha_nacimiento',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de nacimiento del detenido',
  })
  fechaNacimiento: Date

  @ManyToOne(() => EstadoCivil)
  @JoinColumn({
    name: 'id_estado_civil',
  })
  estadoCivil: EstadoCivil

  @Column({
    name: 'foto_frente',
    type: 'text',
    nullable: true,
    comment: 'Fotografía frontal del detenido',
  })
  fotoFrente: string

  @Column({
    name: 'foto_perfil_derecho',
    type: 'text',
    nullable: true,
    comment: 'Fotografía del perfil derecho',
  })
  fotoPerfilDerecho: string

  @Column({
    name: 'foto_perfil_izquierdo',
    type: 'text',
    nullable: true,
    comment: 'Fotografía del perfil izquierdo',
  })
  fotoPerfilIzquierdo: string

  @Column({
    name: 'direccion',
    type: 'text',
    nullable: true,
    comment: 'Dirección del detenido',
  })
  direccion: string

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
    comment: 'Observaciones generales',
  })
  observaciones: string

  @Column({
    name: 'es_actual',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si el registro es el actual',
  })
  esActual: boolean

  @Column({
    name: 'es_revision_icia',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si está en revisión ICIA',
  })
  esRevisionIcia: boolean

  @Column({
    name: 'tiene_tarjeta',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si tiene tarjeta de registro',
  })
  tieneTarjeta: boolean

  @Column({
    name: 'esta_vivo',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si el detenido se encuentra con vida',
  })
  estaVivo: boolean

  @Column({
    name: 'observaciones_adicionales',
    type: 'text',
    nullable: true,
    comment: 'Observaciones adicionales del registro',
  })
  observacionesAdicionales: string

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
    name: 'fecha_hora actualizacion',
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
