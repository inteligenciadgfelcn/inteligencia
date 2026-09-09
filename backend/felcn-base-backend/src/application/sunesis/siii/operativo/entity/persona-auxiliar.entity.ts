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

const bitTransformer = {
  to: (value: boolean): string => (value ? '1' : '0'),
  from: (value: string | boolean): boolean =>
    typeof value === 'boolean' ? value : value === '1',
}

/**
 * Entidad PersonaAuxiliar
 * Personas implicadas en un operativo (módulo operativo).
 * Tabla: public.persona_auxiliar
 */
@Entity({ name: 'persona_auxiliar', schema: SCHEMA_PUBLIC })
export class PersonaAuxiliar {
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

  @Column({ name: 'apellido_materno', type: 'varchar', length: 50 })
  apellidoMaterno: string

  @Column({ name: 'apellido_esposo', type: 'varchar', length: 50 })
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

  @Column({ name: 'estado', type: 'varchar', length: 30 })
  estado: string

  @Column({ name: 'foto_frente', type: 'bytea', nullable: true })
  fotoFrente?: Buffer

  @Column({ name: 'foto_perfil_izquierdo', type: 'bytea', nullable: true })
  fotoPerfilIzquierdo?: Buffer

  @Column({ name: 'foto_documento', type: 'bytea', nullable: true })
  fotoDocumento?: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp', default: () => 'now()' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @Column({ name: 'enviado', type: 'integer', default: 0 })
  enviado: number

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  pais?: Pais

  @ManyToOne(() => TipoDocumento)
  @JoinColumn({ name: 'id_tipo_documento' })
  tipoDocumento?: TipoDocumento

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<PersonaAuxiliar>) {
    if (data) Object.assign(this, data)
  }
}
