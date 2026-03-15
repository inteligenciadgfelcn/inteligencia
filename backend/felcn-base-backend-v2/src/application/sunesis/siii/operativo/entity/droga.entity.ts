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
import { EstadoDroga } from './estado-droga.entity'
import { FormaTransporte } from '../../parametrica/entity/operativo/forma-transporte.entity'
import { Pais } from '../../parametrica/entity/geografia/pais.entity'

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

  @Column({ name: 'id_estado_droga', type: 'integer' })
  idEstadoDroga: number

  @Column({ name: 'cantidad', type: 'double precision' })
  cantidadGramos: number

  @Column({ name: 'capsulas', type: 'integer', default: 0 })
  cantidadUnidades: number

  @Column({ name: 'id_forma_transporte', type: 'integer' })
  idFormaTransporte: number

  @Column({ name: 'id_pais', type: 'integer' })
  idPaisProcedencia: number

  @Column({ name: 'id_pais_destino', type: 'integer' })
  idPaisDestino: number

  @Column({ name: 'prueba', type: 'bytea', nullable: true })
  fotoPruebaCampo?: Buffer

  @Column({ name: 'pesaje', type: 'bytea', nullable: true })
  fotoPesaje?: Buffer

  @Column({ name: 'costo', type: 'double precision', default: 0 })
  costo: number

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => EstadoDroga)
  @JoinColumn({ name: 'id_estado_droga' })
  estadoDroga?: EstadoDroga

  @ManyToOne(() => FormaTransporte)
  @JoinColumn({ name: 'id_forma_transporte' })
  formaTransporte?: FormaTransporte

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  paisProcedencia?: Pais

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais_destino' })
  paisDestino?: Pais

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
