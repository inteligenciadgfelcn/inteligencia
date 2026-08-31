import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ItemBienSecuestrado } from '../../../operativo/entity/item-bien-secuestrado.entity'

/**
 * Entidad BienIncautado
 * Registra la incautación formal de un ítem de bien mediante resolución judicial.
 * Origen: FRM-JUR-03.aspx.cs — btnincautado_Click / MuestraIncautado
 * Tabla: public.bien_incautado
 */
@Entity({ name: 'bien_incautado', schema: SCHEMA_PUBLIC })
export class BienIncautado {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_bien_incautado' })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'numero_resolucion', type: 'varchar', length: 30 })
  numeroResolucion: string

  @Column({ name: 'fecha_res', type: 'timestamp' })
  fechaResolucion: Date

  @Column({ name: 'autoridad', type: 'varchar', length: 300 })
  autoridad: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  constructor(data?: Partial<BienIncautado>) {
    if (data) Object.assign(this, data)
  }
}
