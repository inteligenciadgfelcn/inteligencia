import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { ItemBienSecuestrado } from './item-bien-secuestrado.entity'

/**
 * Entidad Item Bien Característica
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: item_bien_caracteristica
 */
@Entity({ name: 'item_bien_caracteristica', schema: SCHEMA_PUBLIC })
export class ItemBienCaracteristica {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_item_bien_caracteristica',
  })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'id_catalogo_caracteristica', type: 'integer' })
  idCatalogoCaracteristica: number

  @Column({ name: 'descripcion', type: 'varchar', length: 255 })
  descripcion: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<ItemBienCaracteristica>) {
    if (data) Object.assign(this, data)
  }
}
