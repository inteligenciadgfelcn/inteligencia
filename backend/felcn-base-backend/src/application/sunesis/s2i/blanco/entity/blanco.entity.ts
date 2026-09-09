import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iPais } from '../../parametrica/entity/pais.entity'

/**
 * Tabla: public.blanco
 * Persona investigada dentro de un caso
 * Equivalente a la tabla Blancos del sistema legado
 */
@Entity({ name: 'blanco', schema: SCHEMA_PUBLIC })
export class S2iBlanco {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_blanco' })
  idBlanco: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'de_nombres', type: 'varchar', length: 75 })
  deNombres: string

  @Column({ name: 'de_paterno', type: 'varchar', length: 50 })
  dePaterno: string

  @Column({ name: 'de_materno', type: 'varchar', length: 50 })
  deMaterno: string

  @Column({ name: 'de_esposo', type: 'varchar', length: 50 })
  deEsposo: string

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'alias', type: 'varchar', length: 20 })
  alias: string

  @Column({ name: 'numero_documento', type: 'varchar', length: 20 })
  numeroDocumento: string

  /** Foto del blanco almacenada en bytea — se sirve vía GET /foto */
  @Column({ name: 'foto', type: 'bytea', nullable: true })
  foto?: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iPais)
  @JoinColumn({ name: 'id_pais' })
  pais?: S2iPais

  constructor(data?: Partial<S2iBlanco>) {
    if (data) Object.assign(this, data)
  }
}
