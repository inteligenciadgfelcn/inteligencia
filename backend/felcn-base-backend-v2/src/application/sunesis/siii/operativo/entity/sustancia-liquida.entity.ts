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
import { SustanciaLiquidaDescripcion } from '../../parametrica/entity/sustancia/sustancia-liquida-descripcion.entity'

/**
 * Entidad Sustancia Líquida
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: sustancia_liquida
 */
@Entity({ name: 'sustancia_liquida', schema: SCHEMA_PUBLIC })
export class SustanciaLiquida {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_sustancia_liquida' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_sustancia_liquida_descripcion', type: 'integer' })
  idSustanciaLiquidaDescripcion: number

  @Column({ name: 'cantidad', type: 'double precision' })
  cantidad: number

  @Column({ name: 'costo', type: 'double precision', default: 0 })
  costo: number

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => SustanciaLiquidaDescripcion)
  @JoinColumn({ name: 'id_sustancia_liquida_descripcion' })
  descripcionRef?: SustanciaLiquidaDescripcion

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<SustanciaLiquida>) {
    if (data) Object.assign(this, data)
  }
}
