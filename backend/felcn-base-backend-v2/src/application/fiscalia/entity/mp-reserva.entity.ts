import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/** Tablas destino de una reserva (3.16) */
export enum TablaReserva {
  CASO = 1,
  SUJETO = 2,
  ACTIVIDAD = 3,
}

/**
 * Entidad MpReserva
 * Historial de reservas de caso / sujeto / actividad enviadas por el MP (3.16).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_reserva
 */
@Entity({ name: 'mp_reserva', schema: SCHEMA_FISCALIA })
export class MpReserva {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_reserva_id' })
  polReservaId: string

  @Column({ name: 'tabla', type: 'smallint' })
  tabla: number

  @Column({ name: 'tabla_id', type: 'bigint' })
  tablaId: string

  @Column({ name: 'estado', type: 'integer' })
  estado: number

  @Column({ name: 'fecha_fin_reserva', type: 'timestamptz', nullable: true })
  fechaFinReserva: Date | null

  @Column({ name: 'homologado', type: 'boolean', default: false })
  homologado: boolean

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date
}
