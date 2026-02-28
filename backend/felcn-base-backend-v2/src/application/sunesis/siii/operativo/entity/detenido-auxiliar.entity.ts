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
 * Entidad Detenido Auxiliar
 * Personas detenidas en un operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: detenido_auxiliar
 */
@Entity({ name: 'detenido_auxiliar', schema: SCHEMA_PUBLIC })
export class DetenidoAuxiliar {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_detenido_auxiliar' })
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

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'es_masculino', type: 'boolean' })
  esMasculino: boolean

  @Column({ name: 'fecha_nacimiento', type: 'timestamp', nullable: true })
  fechaNacimiento?: Date

  @Column({ name: 'id_estado_civil', type: 'integer' })
  idEstadoCivil: number

  @Column({ name: 'serie', type: 'varchar', length: 50 })
  serie: string

  @Column({ name: 'seccion', type: 'varchar', length: 50 })
  seccion: string

  @Column({ name: 'foto_frente', type: 'bytea', nullable: true })
  fotoFrente?: Buffer

  @Column({ name: 'foto_perfil_derecho', type: 'bytea', nullable: true })
  fotoPerfilDerecho?: Buffer

  @Column({ name: 'foto_perfil_izquierdo', type: 'bytea', nullable: true })
  fotoPerfilIzquierdo?: Buffer

  @Column({ name: 'direccion', type: 'varchar', length: 255 })
  direccion: string

  @Column({ name: 'observaciones', type: 'text' })
  observaciones: string

  @Column({ name: 'es_actual', type: 'boolean' })
  esActual: boolean

  @Column({ name: 'es_revision_icia', type: 'boolean' })
  esRevisionIcia: boolean

  @Column({ name: 'tiene_tarjeta', type: 'boolean' })
  tieneTarjeta: boolean

  @Column({ name: 'esta_vivo', type: 'boolean' })
  estaVivo: boolean

  @Column({ name: 'observaciones_adicionales', type: 'text' })
  observacionesAdicionales: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 50 })
  usuario: string

  @Column({ name: 'fecha_hora_actualizacion', type: 'timestamp' })
  fechaHoraActualizacion: Date

  @Column({ name: 'usuario_actualizacion', type: 'varchar', length: 15 })
  usuarioActualizacion: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @BeforeInsert()
  insertarFechaIngreso() {
    const now = new Date()
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = now
    }
    if (!this.fechaHoraActualizacion) {
      this.fechaHoraActualizacion = now
    }
  }

  constructor(data?: Partial<DetenidoAuxiliar>) {
    if (data) Object.assign(this, data)
  }
}
