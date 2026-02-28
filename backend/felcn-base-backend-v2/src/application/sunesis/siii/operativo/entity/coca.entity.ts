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
 * Entidad Coca
 * Hoja de coca secuestrada
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: coca
 */
@Entity({ name: 'coca', schema: SCHEMA_PUBLIC })
export class Coca {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_coca' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_coca_procedencia', type: 'integer' })
  idCocaProcedencia: number

  @Column({ name: 'id_coca_estado', type: 'integer' })
  idCocaEstado: number

  @Column({ name: 'id_coca_descripcion', type: 'integer' })
  idCocaDescripcion: number

  @Column({ name: 'cantidad_kilogramos', type: 'double precision' })
  cantidadKilogramos: number

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

  constructor(data?: Partial<Coca>) {
    if (data) Object.assign(this, data)
  }
}
