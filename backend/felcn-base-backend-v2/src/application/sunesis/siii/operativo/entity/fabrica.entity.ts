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
 * Entidad Fábrica/Laboratorio
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: fabrica
 */
@Entity({ name: 'fabrica', schema: SCHEMA_PUBLIC })
export class Fabrica {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_fabrica' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_fabrica_modelo', type: 'integer' })
  idFabricaModelo: number

  @Column({ name: 'cantidad', type: 'integer' })
  cantidad: number

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

  constructor(data?: Partial<Fabrica>) {
    if (data) Object.assign(this, data)
  }
}
