import { ColorCabello } from '@/application/inteligencia/felcn_sii/parametricas/color_cabello/entities/color_cabello.entity'
import { ColorOjo } from '@/application/inteligencia/felcn_sii/parametricas/color_ojos/entities/color_ojo.entity'
import { ColorPiel } from '@/application/inteligencia/felcn_sii/parametricas/color_piel/entities/color_piel.entity'
import { EstadoCivil } from '@/application/inteligencia/felcn_sii/parametricas/estado_civil/entities/estado_civil.entity'
import { Pais } from '@/application/inteligencia/felcn_sii/parametricas/pais/entities/pais.entity'
import { TipoCabello } from '@/application/inteligencia/felcn_sii/parametricas/tipo_cabello/entities/tipo_cabello.entity'
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm'

@Entity({ name: 'arrestado_auxiliar', schema: 'public' })
export class ArrestadoAuxiliar {
  @PrimaryGeneratedColumn({
    name: 'id_arrestado_auxiliar',
    type: 'int',
    comment: 'Clave primaria del registro de arrestado auxiliar',
  })
  idArrestadoAuxiliar: number

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

  @Column({
    name: 'es_masculino',
    type: 'boolean',
    nullable: true,
    comment: 'Indica si el detenido es de sexo masculino',
  })
  genero: boolean

  @ManyToOne(() => Pais)
  @JoinColumn({
    name: 'id_pais',
  })
  pais: Pais

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    nullable: true,
    comment: 'Numero de documento de identificación',
  })
  numeroDocumento: string

  @Column({
    name: 'fecha_nacimiento',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de nacimiento del detenido',
  })
  fechaNacimiento: Date

  @Column({
    name: 'lugar_nacimiento',
    type: 'varchar',
    nullable: true,
    comment: 'Fecha de nacimiento del detenido',
  })
  lugarNacimiento: Date

  @ManyToOne(() => EstadoCivil)
  @JoinColumn({
    name: 'id_estado_civil',
  })
  estadoCivil: EstadoCivil

  @Column({
    name: 'ocupacion',
    type: 'varchar',
    nullable: true,
    comment: 'Profesión del arrestado',
  })
  ocupacion: string

  @Column({
    name: 'direccion',
    type: 'text',
    nullable: true,
    comment: 'Dirección del detenido',
  })
  direccion: string

  @Column({
    name: 'estatura',
    type: 'varchar',
    length: 10,
  })
  estatura: string

  @Column({
    name: 'foto_frente',
    type: 'text',
    nullable: true,
    comment: 'Fotografía frontal del detenido',
  })
  fotoFrente: string

  @Column({
    name: 'foto_dedo_derecho',
    type: 'text',
    nullable: true,
    comment: 'Fotografía del dedo derecho',
  })
  fotoDedoDerecho: string

  @Column({
    name: 'foto_dedo_izquierdo',
    type: 'text',
    nullable: true,
    comment: 'Fotografía del dedo izquierdo',
  })
  fotoDedoIzquierdo: string

  @ManyToOne(() => ColorPiel)
  @JoinColumn({ name: 'id_color_piel' })
  colorPiel: ColorPiel

  @ManyToOne(() => ColorOjo)
  @JoinColumn({ name: 'id_color_ojos' })
  colorOjos: ColorOjo

  @ManyToOne(() => TipoCabello)
  @JoinColumn({ name: 'id_tipo_cabello' })
  tipoCabello: TipoCabello

  @ManyToOne(() => ColorCabello)
  @JoinColumn({ name: 'id_color_cabello' })
  colorCabello: ColorCabello

  @Column({
    name: 'senas',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  senasParticulares: string

  @Column({
    name: 'lugar_arresto',
    type: 'varchar',
    nullable: true,
    comment: 'Lugar de arresto',
  })
  lugarArresto: string

  @Column({
    name: 'observaciones',
    type: 'text',
    nullable: true,
    comment: 'Observaciones generales',
  })
  observaciones: string
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
