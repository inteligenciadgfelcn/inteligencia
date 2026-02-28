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
 * Entidad Droga
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: droga
 */
@Entity({ name: 'droga', schema: SCHEMA_PUBLIC })
export class Droga {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_droga' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_tipo_droga', type: 'integer' })
  idTipoDroga: number

  @Column({ name: 'id_estado_droga', type: 'integer' })
  idEstadoDroga: number

  @Column({ name: 'cantidad_gramos', type: 'double precision' })
  cantidadGramos: number

  @Column({ name: 'cantidad_unidades', type: 'integer', default: 0 })
  cantidadUnidades: number

  @Column({ name: 'id_forma_transporte', type: 'integer' })
  idFormaTransporte: number

  @Column({ name: 'id_pais_procedencia', type: 'integer' })
  idPaisProcedencia: number

  @Column({ name: 'id_pais_destino', type: 'integer' })
  idPaisDestino: number

  @Column({ name: 'foto_prueba_campo', type: 'bytea', nullable: true })
  fotoPruebaCampo?: Buffer

  @Column({ name: 'foto_pesaje', type: 'bytea', nullable: true })
  fotoPesaje?: Buffer

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<Droga>) {
    if (data) Object.assign(this, data)
  }
}
