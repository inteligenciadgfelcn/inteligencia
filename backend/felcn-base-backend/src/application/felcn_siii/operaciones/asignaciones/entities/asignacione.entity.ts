import { Departamento } from '@/application/felcn_siii/parametricas/departamento/entities/departamento.entity'
import { Distrital } from '@/application/felcn_siii/parametricas/distrital/entities/distrital.entity'
import { Grupo } from '@/application/felcn_siii/parametricas/grupo/entities/grupo.entity'
import { Unidad } from '@/application/felcn_siii/parametricas/unidad/entities/unidad.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'asignacion', schema: 'public' })
export class Asignacion {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_caso',
    comment: 'Clave primaria del registro',
  })
  idAsignacion: number

  @ManyToOne(() => Departamento)
  @JoinColumn({
    name: 'abreviatura_departamento',
    referencedColumnName: 'abreviatura',
  })
  departamento: Departamento

  @ManyToOne(() => Unidad)
  @JoinColumn({
    name: 'abreviatura_unidad',
    referencedColumnName: 'abreviatura',
  })
  unidad: Unidad

  @ManyToOne(() => Distrital)
  @JoinColumn({ name: 'id_distrital', referencedColumnName: 'idDistrital' })
  distrital: Distrital

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo

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
    name: 'numero_operativo',
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
    name: 'asignado_caso',
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
    name: 'id_etapa_investigacion',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 7,
    comment: 'Etapa de investigación (por defecto 7)',
  })
  etapaInvestigacion: number

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
