import { Grupo } from '@/application/felcn_s2i/grupo/entities/grupo.entity'
import { Departamento } from '@/application/felcn_siii/parametricas/departamento/entities/departamento.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'asignacion', schema: 'public' })
export class Asignacion {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_asignacion',
    comment: 'Clave primaria del registro',
  })
  idAsignacion: number

  @ManyToOne(() => Departamento, { nullable: false })
  @JoinColumn({ name: 'id_departamento_caso' })
  departamento: Departamento

  @Column({
    name: 'abreviatura_unidad',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'abreviatura de la unidad',
  })
  abreviatura_unidad: string

  @Column({
    name: 'id_grupo',
    type: 'int',
  })
  idGrupo: number

  @Column({
    name: 'letras',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Iniciales del principal aprendido',
  })
  letra: string

  @Column({
    name: 'numero_caso',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso generado por departamento y letra por gestión',
  })
  nroCaso: string

  @Column({
    name: 'numero_caso_per_dom',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso correspondiente a PER-DOM si aplica',
  })
  nroCasoPerDom: string

  @Column({
    name: 'nro_operativo',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment:
      'Número único de operativo generado por departamento y unidad por gestión',
  })
  nroOperativo: string

  @Column({
    name: 'codigo_servicio',
    type: 'varchar',
    length: 100,
    comment: 'Código interno del servicio asociado a la asignación',
  })
  codigoServicio: string

  @Column({
    name: 'ianus',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código IANUS asociado al caso si corresponde',
  })
  ianus: string

  @Column({
    name: 'nombre_caso',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nombre descriptivo del caso',
  })
  nombreCaso: string

  @Column({
    name: 'nombre_solicitud',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Nombre del solicitante',
  })
  nombreSolicitud: string

  @Column({
    name: 'telefono_solicitud',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono de contacto del solicitante',
  })
  telefonoSolicitud: string

  @Column({
    name: 'signado_caso',
    type: 'varchar',
    length: 150,
    comment: 'Nombre del investigador o responsable asignado',
  })
  asignado: string

  @Column({
    name: 'telefono_asignado',
    type: 'varchar',
    length: 20,
    comment: 'Teléfono del responsable asignado',
  })
  telefonoAsignado: string

  @Column({
    name: 'fiscal_asignado_caso',
    type: 'varchar',
    length: 150,
    comment: 'Nombre del fiscal asignado al caso',
  })
  fiscalAsignado: string

  @Column({
    name: 'telefono_fiscal',
    type: 'varchar',
    length: 20,
    comment: 'Teléfono de contacto del fiscal asignado',
  })
  telefonoFiscal: string

  @Column({
    name: 'eta_inv',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 7,
    comment: 'Tiempo estimado de investigación en días (por defecto 7)',
  })
  etaInv: number

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el operativo tuvo resultado positivo',
  })
  resultado: boolean

  @Column({
    name: 'fecha_hora_ingreso',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha en la que se realizó la solicitud',
  })
  fechaSolicitud: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    nullable: true,
    comment: 'Nro de pase de usuario',
  })
  usuario: string
}
