import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { Operativo } from './operativo.entity'
import { TipoDroga } from '../../parametrica/entity/tipo/tipo-droga.entity'
import { Pais } from '../../parametrica/entity/geografia/pais.entity'

/**
 * Entidad Logotipo
 * Logos asociados directamente al operativo (sección independiente,
 * igual que Bienes o Galería)
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: logotipo
 */
@Entity({ name: 'logotipo', schema: SCHEMA_PUBLIC })
export class Logotipo extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_logotipo' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'imagen', type: 'varchar', length: 50 })
  imagen: string

  @Column({ name: 'descripcion_logo', type: 'text' })
  descripcionLogo: string

  @Column({ name: 'id_tipo_droga', type: 'integer', nullable: true })
  idTipoDroga?: number

  @Column({ name: 'id_pais_origen', type: 'integer', nullable: true })
  idPaisOrigen?: number

  @Column({ name: 'id_pais_destino', type: 'integer', nullable: true })
  idPaisDestino?: number

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

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => TipoDroga)
  @JoinColumn({ name: 'id_tipo_droga' })
  tipoDroga?: TipoDroga

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais_origen' })
  paisOrigen?: Pais

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais_destino' })
  paisDestino?: Pais

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<Logotipo>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
