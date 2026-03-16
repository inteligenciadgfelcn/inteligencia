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
import { Pais } from '../../parametrica/entity/geografia/pais.entity'
import { TipoDocumento } from '../../parametrica/entity/tipo/tipo-documento.entity'

export enum EstadoPersonaAuxiliar {
  PRINCIPAL_IMPLICADO = 'Principal Implicado',
  APREHENDIDO = 'Aprehendido',
  ARRESTADO = 'Arrestado',
  LGI = 'LGI O Perdida de Dominio',
}

const bitTransformer = {
  to: (value: boolean): string => (value ? '1' : '0'),
  from: (value: string | boolean): boolean =>
    typeof value === 'boolean' ? value : value === '1',
}

/**
 * Entidad Persona Auxiliar
 * Personas implicadas en un operativo
 * Base de datos: felcn_siii
 * Schema: public
 * Tabla: persona_auxiliar
 */
@Entity({ name: 'persona_auxiliar', schema: SCHEMA_PUBLIC })
export class DetenidoAuxiliar {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_persona_auxiliar' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'id_tipo_documento', type: 'integer' })
  idTipoDocumento: number

  @Column({ name: 'nombres', type: 'varchar', length: 50 })
  nombres: string

  @Column({ name: 'apellido_paterno', type: 'varchar', length: 50 })
  apellidoPaterno: string

  @Column({ name: 'apellido_materno', type: 'varchar', length: 50, default: '' })
  apellidoMaterno: string

  @Column({ name: 'apellido_esposo', type: 'varchar', length: 50, default: '' })
  apellidoEsposo: string

  @Column({ name: 'nro_documento', type: 'varchar', length: 35 })
  nroDocumento: string

  @Column({ name: 'fecha_nacimiento', type: 'timestamp', nullable: true })
  fechaNacimiento?: Date

  @Column({
    name: 'genero',
    type: 'bit',
    width: 1,
    transformer: bitTransformer,
  })
  genero: boolean

  @Column({ name: 'direccion', type: 'varchar', length: 255 })
  direccion: string

  @Column({
    name: 'estado',
    type: 'enum',
    enum: EstadoPersonaAuxiliar,
  })
  estado: EstadoPersonaAuxiliar

  @Column({ name: 'foto_frente', type: 'bytea', nullable: true })
  fotoFrente?: Buffer

  @Column({ name: 'foto_perfil_derecho', type: 'bytea', nullable: true })
  fotoPerfilDerecho?: Buffer

  @Column({ name: 'foto_perfil_izquierdo', type: 'bytea', nullable: true })
  fotoPerfilIzquierdo?: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  paisNacionalidad?: Pais

  @ManyToOne(() => TipoDocumento)
  @JoinColumn({ name: 'id_tipo_documento' })
  tipoDocumento?: TipoDocumento

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<DetenidoAuxiliar>) {
    if (data) Object.assign(this, data)
  }
}
