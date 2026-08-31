import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iItemBienInvestigado } from './item-bien-investigado.entity'

/**
 * Tabla: public.lugar_bien
 * Ubicaciones SIG del bien investigado
 * FK CASCADE a item_bien_investigado
 */
@Entity({ name: 'lugar_bien', schema: SCHEMA_PUBLIC })
export class S2iLugarBien {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_lugar_bien' })
  idLugarBien: string

  @Column({ name: 'id_item_bien_secundario', type: 'bigint' })
  idItemBienSecundario: string

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string

  @Column({ name: 'coordenas_x', type: 'double precision' })
  coordenadasX: number

  @Column({ name: 'coordenas_y', type: 'double precision' })
  coordenadasY: number

  @Column({ name: 'contenido', type: 'text' })
  contenido: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iItemBienInvestigado)
  @JoinColumn({ name: 'id_item_bien_secundario' })
  itemBienInvestigado?: S2iItemBienInvestigado

  constructor(data?: Partial<S2iLugarBien>) {
    if (data) Object.assign(this, data)
  }
}
