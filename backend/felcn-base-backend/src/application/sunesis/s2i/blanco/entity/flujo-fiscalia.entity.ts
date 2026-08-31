import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { S2iFlujoTelefonico } from './flujo-telefonico.entity'

/**
 * Tabla: public.flujo_fiscalia
 * Detalle de llamada (fiscalía) dentro de un flujo telefónico: extremos A/B,
 * ubicación de celda, IMEI, duración, etc.
 * FK a flujo_telefonico. Auditoría gestionada por triggers de BD.
 */
@Entity({ name: 'flujo_fiscalia', schema: SCHEMA_PUBLIC })
export class S2iFlujoFiscalia extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_flujo_fiscalia' })
  idFlujoFiscalia: string

  @Column({ name: 'id_flujo', type: 'bigint' })
  idFlujo: string

  @Column({ name: 'servicio', type: 'varchar', length: 15 })
  servicio: string

  @Column({ name: 'registro', type: 'varchar', length: 50 })
  registro: string

  @Column({ name: 'numero_a', type: 'varchar', length: 15 })
  numeroA: string

  @Column({ name: 'imei_a', type: 'varchar', length: 50 })
  imeiA: string

  @Column({ name: 'rbs_a', type: 'varchar', length: 25 })
  rbsA: string

  @Column({ name: 'celda_a', type: 'varchar', length: 10 })
  celdaA: string

  @Column({ name: 'lat_a', type: 'float8' })
  latA: number

  @Column({ name: 'lon_a', type: 'float8' })
  lonA: number

  @Column({ name: 'numero_b', type: 'varchar', length: 15 })
  numeroB: string

  @Column({ name: 'titular', type: 'varchar', length: 80 })
  titular: string

  @Column({ name: 'imei_b', type: 'varchar', length: 50 })
  imeiB: string

  @Column({ name: 'rbs_b', type: 'varchar', length: 25 })
  rbsB: string

  @Column({ name: 'celda_b', type: 'varchar', length: 10 })
  celdaB: string

  @Column({ name: 'lat_b', type: 'float8' })
  latB: number

  @Column({ name: 'lon_b', type: 'float8' })
  lonB: number

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date

  @Column({ name: 'duracion', type: 'varchar', length: 15 })
  duracion: string

  @ManyToOne(() => S2iFlujoTelefonico)
  @JoinColumn({ name: 'id_flujo' })
  flujoTelefonico?: S2iFlujoTelefonico

  constructor(data?: Partial<S2iFlujoFiscalia>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
