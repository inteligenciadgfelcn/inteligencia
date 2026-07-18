import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'
import { VlsMarca } from './marca.entity'
import { VlsModelo } from './modelo.entity'
import { VlsClase } from './clase.entity'
import { VlsColor } from './color.entity'

/**
 * Tabla: public.vehiculo (base de datos felcn_vls)
 * Registro vehicular consultado por placa. Solo lectura.
 */
@Entity({ name: 'vehiculo', schema: SCHEMA_PUBLIC })
export class VlsVehiculo {
  @PrimaryColumn({ name: 'id_vehiculo', type: 'integer' })
  id: number

  @Column({ name: 'placa', type: 'text', nullable: true })
  placa: string

  @Column({ name: 'tipo_vehiculo', type: 'text', nullable: true })
  tipoVehiculo: string

  @Column({ name: 'motor', type: 'text' })
  motor: string

  @Column({ name: 'chasis', type: 'text' })
  chasis: string

  @Column({ name: 'id_marca', type: 'integer' })
  idMarca: number

  @Column({ name: 'id_modelo', type: 'integer' })
  idModelo: number

  @Column({ name: 'id_clase', type: 'integer' })
  idClase: number

  @Column({ name: 'id_color', type: 'integer', nullable: true })
  idColor: number | null

  @ManyToOne(() => VlsMarca)
  @JoinColumn({ name: 'id_marca' })
  marca?: VlsMarca

  @ManyToOne(() => VlsModelo)
  @JoinColumn({ name: 'id_modelo' })
  modelo?: VlsModelo

  @ManyToOne(() => VlsClase)
  @JoinColumn({ name: 'id_clase' })
  clase?: VlsClase

  @ManyToOne(() => VlsColor)
  @JoinColumn({ name: 'id_color' })
  color?: VlsColor
}
