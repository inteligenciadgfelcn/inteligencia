import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ItemBienSecuestrado } from '../../../operativo/entity/item-bien-secuestrado.entity'

/**
 * Entidad PerdidaDominio
 * Registra el proceso de pérdida de dominio de un ítem de bien secuestrado.
 * Origen: FRM-JUR-03.aspx.cs — btnperdidadom_Click / MuestraDominio
 * Tabla: public.perdida_dominio
 */
@Entity({ name: 'perdida_dominio', schema: SCHEMA_PUBLIC })
export class PerdidaDominio {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_perdida_dominio' })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'fiscalia', type: 'varchar', length: 100 })
  fiscalia: string

  @Column({ name: 'fecha_resolucion', type: 'timestamp' })
  fechaResolucion: Date

  @Column({ name: 'autoridad', type: 'varchar', length: 300 })
  autoridad: string

  // DEFAULT now() en la BD; se asigna en servicio para mayor control
  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp', default: () => 'now()' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  constructor(data?: Partial<PerdidaDominio>) {
    if (data) Object.assign(this, data)
  }
}
