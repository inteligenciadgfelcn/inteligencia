import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ItemBienSecuestrado } from '../../../operativo/entity/item-bien-secuestrado.entity'

/**
 * Entidad BienConfiscado
 * Registra la confiscación de un ítem de bien mediante sentencia judicial.
 * Origen: FRM-JUR-03.aspx.cs — btnconfiscado_Click / MuestraConfiscado
 * Tabla: public.bien_confiscado
 */
@Entity({ name: 'bien_confiscado', schema: SCHEMA_PUBLIC })
export class BienConfiscado {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_bien_confiscado' })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'numero_sentencia_judicial', type: 'varchar', length: 50 })
  numeroSentenciaJudicial: string

  @Column({ name: 'fecha_sentencia_judicial', type: 'timestamp' })
  fechaSentenciaJudicial: Date

  @Column({ name: 'autoridad', type: 'varchar', length: 300 })
  autoridad: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  constructor(data?: Partial<BienConfiscado>) {
    if (data) Object.assign(this, data)
  }
}
