import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Droga } from './droga.entity'

/**
 * Entidad Logotipo
 * Logos asociados a una droga del operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: logotipo
 */
@Entity({ name: 'logotipo', schema: SCHEMA_PUBLIC })
export class Logotipo {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_logotipo' })
  id: string

  @Column({ name: 'id_droga', type: 'bigint' })
  idDroga: string

  @Column({ name: 'imagen', type: 'varchar', length: 50 })
  imagen: string

  @Column({ name: 'descripcion_logo', type: 'text' })
  descripcionLogo: string

  @Column({ name: 'organizacion', type: 'varchar', length: 50 })
  organizacion: string

  @Column({ name: 'blanco', type: 'text' })
  blanco: string

  @Column({ name: 'observacion', type: 'text' })
  observacion: string

  @Column({ name: 'fotografia', type: 'bytea' })
  fotografia: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Droga)
  @JoinColumn({ name: 'id_droga' })
  droga?: Droga

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<Logotipo>) {
    if (data) Object.assign(this, data)
  }
}
