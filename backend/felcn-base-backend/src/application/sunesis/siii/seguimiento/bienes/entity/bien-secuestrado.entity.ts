import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ItemBienSecuestrado } from '../../../operativo/entity/item-bien-secuestrado.entity'

/**
 * Entidad BienSecuestrado
 * Registra el acto de secuestro de un ítem de bien durante un operativo.
 * Origen: FRM-JUR-03.aspx.cs — btnsecuestro_Click / MuestraSecuestrado
 * Tabla: public.bien_secuestrado
 */
@Entity({ name: 'bien_secuestrado', schema: SCHEMA_PUBLIC })
export class BienSecuestrado {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_bien_secuestrado' })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'fiscal', type: 'varchar', length: 250 })
  fiscal: string

  @Column({ name: 'fecha_acto_secuestro', type: 'timestamp' })
  fechaActoSecuestro: Date

  @Column({ name: 'investigador', type: 'varchar', length: 250 })
  investigador: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  constructor(data?: Partial<BienSecuestrado>) {
    if (data) Object.assign(this, data)
  }
}
