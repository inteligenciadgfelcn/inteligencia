import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Operativo } from './operativo.entity'

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

  @Column({ name: 'unidad_medida', type: 'varchar', length: 20 })
  unidadMedida: string

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

  constructor(data?: Partial<SustanciaLiquida>) {
    if (data) Object.assign(this, data)
  }
}
