import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Operativo } from './operativo.entity'

/**
 * Entidad Sustancia Sólida
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: sustancia_solida
 */
@Entity({ name: 'sustancia_solida', schema: SCHEMA_PUBLIC })
export class SustanciaSolida {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_sustancia_solida' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_sustancia_solida_descripcion', type: 'integer' })
  idSustanciaSolidaDescripcion: number

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

  constructor(data?: Partial<SustanciaSolida>) {
    if (data) Object.assign(this, data)
  }
}
