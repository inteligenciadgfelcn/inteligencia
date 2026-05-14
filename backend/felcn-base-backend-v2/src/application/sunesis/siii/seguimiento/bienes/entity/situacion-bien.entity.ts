import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ItemBienSecuestrado } from '../../../operativo/entity/item-bien-secuestrado.entity'
import { CalidadBien } from '../../../parametrica/entity/bien/calidad-bien.entity'

/**
 * Entidad SituacionBien
 * Registra la situación actual y el historial de entregas de un ítem de bien secuestrado.
 * Incluye datos del fiscal requirente, responsable de entrega y receptor.
 * Origen: FRM-JUR-03.aspx.cs — btnentrega_Click / Muestraestado
 * Tabla: public.situacion_bien
 */
@Entity({ name: 'situacion_bien', schema: SCHEMA_PUBLIC })
export class SituacionBien {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_situacion_bien' })
  id: string

  @Column({ name: 'id_item_bien_secuestrado', type: 'bigint' })
  idItemBienSecuestrado: string

  @Column({ name: 'fecha_requerimiento', type: 'timestamp' })
  fechaRequerimiento: Date

  @Column({ name: 'fiscal_requerimiento', type: 'varchar', length: 300 })
  fiscalRequerimiento: string

  @Column({ name: 'id_calidad_bien', type: 'integer' })
  idCalidadBien: number

  @Column({ name: 'fecha_entrega', type: 'timestamp' })
  fechaEntrega: Date

  @Column({ name: 'responsable_entrega', type: 'varchar', length: 150 })
  responsableEntrega: string

  @Column({ name: 'responsable_recepcion', type: 'varchar', length: 150 })
  responsableRecepcion: string

  @Column({ name: 'institucion', type: 'varchar', length: 150 })
  institucion: string

  @Column({ name: 'ubicacion', type: 'varchar', length: 150 })
  ubicacion: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => ItemBienSecuestrado)
  @JoinColumn({ name: 'id_item_bien_secuestrado' })
  itemBienSecuestrado?: ItemBienSecuestrado

  @ManyToOne(() => CalidadBien)
  @JoinColumn({ name: 'id_calidad_bien' })
  calidadBien?: CalidadBien

  constructor(data?: Partial<SituacionBien>) {
    if (data) Object.assign(this, data)
  }
}
