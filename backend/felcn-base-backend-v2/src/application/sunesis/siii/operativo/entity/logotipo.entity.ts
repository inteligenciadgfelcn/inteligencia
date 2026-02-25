import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Operativo } from './operativo.entity'

/**
 * Entidad Logotipo
 * Logos del operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: logotipo
 */
@Entity({ name: 'logotipo', schema: SCHEMA_PUBLIC })
export class Logotipo {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_logotipo' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'numero_caso', type: 'varchar', length: 20 })
  numeroCaso: string

  @Column({ name: 'numero_operativo', type: 'varchar', length: 20 })
  numeroOperativo: string

  @Column({ name: 'fecha_operativo', type: 'timestamp' })
  fechaOperativo: Date

  @Column({ name: 'nombre_caso', type: 'varchar', length: 30 })
  nombreCaso: string

  @Column({ name: 'descripcion', type: 'text' })
  descripcion: string

  @Column({ name: 'imagen', type: 'varchar', length: 50 })
  imagen: string

  @Column({ name: 'descripcion_logo', type: 'text' })
  descripcionLogo: string

  @Column({ name: 'id_tipo_droga', type: 'integer' })
  idTipoDroga: number

  @Column({ name: 'id_pais_origen', type: 'integer' })
  idPaisOrigen: number

  @Column({ name: 'id_pais_destino', type: 'integer' })
  idPaisDestino: number

  @Column({ name: 'organizacion', type: 'varchar', length: 50 })
  organizacion: string

  @Column({ name: 'blanco', type: 'text' })
  blanco: string

  @Column({ name: 'observacion', type: 'text' })
  observacion: string

  @Column({ name: 'enlace', type: 'varchar', length: 300 })
  enlace: string

  @Column({ name: 'fotografia', type: 'bytea' })
  fotografia: Buffer

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

  constructor(data?: Partial<Logotipo>) {
    if (data) Object.assign(this, data)
  }
}
