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
import { S2aCatalogoCaracteristica } from '../../parametrica/entity/catalogo-caracteristica.entity'

/**
 * Tabla: public.item_bien_caracteristica
 * Característica específica de un bien investigado (color, modelo, etc.)
 * FK CASCADE a item_bien_investigado
 */
@Entity({ name: 'item_bien_caracteristica', schema: SCHEMA_PUBLIC })
export class S2iItemBienCaracteristica {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id_item_bien_caracteristica',
  })
  idItemBienCaracteristica: number

  @Column({ name: 'id_item_bien_secundario', type: 'bigint' })
  idItemBienSecundario: string

  @Column({ name: 'id_catalogo_caracteristica', type: 'integer' })
  idCatalogoCaracteristica: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

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

  @ManyToOne(() => S2aCatalogoCaracteristica)
  @JoinColumn({ name: 'id_catalogo_caracteristica' })
  catalogoCaracteristica?: S2aCatalogoCaracteristica

  constructor(data?: Partial<S2iItemBienCaracteristica>) {
    if (data) Object.assign(this, data)
  }
}
