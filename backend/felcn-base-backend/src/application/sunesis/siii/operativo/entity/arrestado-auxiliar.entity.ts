import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Operativo } from './operativo.entity'

/**
 * Entidad Arrestado Auxiliar
 * Personas arrestadas en un operativo con características físicas
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: arrestado_auxiliar
 */
@Entity({ name: 'arrestado_auxiliar', schema: SCHEMA_PUBLIC })
export class ArrestadoAuxiliar {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_arrestado_auxiliar' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'numero_caso', type: 'varchar', length: 50 })
  numeroCaso: string

  @Column({ name: 'nombres', type: 'varchar', length: 50 })
  nombres: string

  @Column({ name: 'apellido_paterno', type: 'varchar', length: 50 })
  apellidoPaterno: string

  @Column({ name: 'apellido_materno', type: 'varchar', length: 50 })
  apellidoMaterno: string

  @Column({ name: 'apellido_esposo', type: 'varchar', length: 50 })
  apellidoEsposo: string

  @Column({ name: 'es_masculino', type: 'boolean' })
  esMasculino: boolean

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'numero_documento', type: 'varchar', length: 15 })
  numeroDocumento: string

  @Column({ name: 'fecha_nacimiento', type: 'timestamp', nullable: true })
  fechaNacimiento?: Date

  @Column({ name: 'lugar_nacimiento', type: 'varchar', length: 150 })
  lugarNacimiento: string

  @Column({ name: 'id_estado_civil', type: 'integer' })
  idEstadoCivil: number

  @Column({ name: 'ocupacion', type: 'varchar', length: 70 })
  ocupacion: string

  @Column({ name: 'direccion', type: 'varchar', length: 255 })
  direccion: string

  @Column({ name: 'estatura', type: 'varchar', length: 50 })
  estatura: string

  @Column({ name: 'id_color_piel', type: 'integer' })
  idColorPiel: number

  @Column({ name: 'id_color_ojos', type: 'integer' })
  idColorOjos: number

  @Column({ name: 'id_color_cabello', type: 'integer' })
  idColorCabello: number

  @Column({ name: 'id_tipo_cabello', type: 'integer' })
  idTipoCabello: number

  @Column({ name: 'senas', type: 'varchar', length: 150 })
  senas: string

  @Column({ name: 'lugar_arresto', type: 'varchar', length: 150 })
  lugarArresto: string

  @Column({ name: 'foto_frente', type: 'bytea', nullable: true })
  fotoFrente?: Buffer

  @Column({ name: 'foto_dedo_derecho', type: 'bytea', nullable: true })
  fotoDedoDerecho?: Buffer

  @Column({ name: 'foto_dedo_izquierdo', type: 'bytea', nullable: true })
  fotoDedoIzquierdo?: Buffer

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 50 })
  usuario: string

  @Column({
    name: 'fecha_hora_actualizacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaHoraActualizacion?: Date

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<ArrestadoAuxiliar>) {
    if (data) Object.assign(this, data)
  }
}
