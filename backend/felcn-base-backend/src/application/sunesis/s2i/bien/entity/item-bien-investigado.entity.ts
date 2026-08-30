import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2aCatalogoTipo } from '../../parametrica/entity/catalogo-tipo.entity'
import { S2iTipoInvestigacionBien } from '../../parametrica/entity/tipo-investigacion-bien.entity'

/**
 * Tabla: public.item_bien_investigado
 * Bien en investigación vinculado a un caso
 * Jerarquía: caso → item_bien_investigado → item_bien_caracteristica
 * Equivalente a ItemBienInvestigado del sistema legado
 */
@Entity({ name: 'item_bien_investigado', schema: SCHEMA_PUBLIC })
export class S2iItemBienInvestigado {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_item_bien_secundario' })
  idItemBienSecundario: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_catalogo_tipo', type: 'integer' })
  idCatalogoTipo: number

  @Column({ name: 'id_tipo_investigacion_bien', type: 'integer' })
  idTipoInvestigacionBien: number

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2aCatalogoTipo)
  @JoinColumn({ name: 'id_catalogo_tipo' })
  catalogoTipo?: S2aCatalogoTipo

  @ManyToOne(() => S2iTipoInvestigacionBien)
  @JoinColumn({ name: 'id_tipo_investigacion_bien' })
  tipoInvestigacionBien?: S2iTipoInvestigacionBien

  constructor(data?: Partial<S2iItemBienInvestigado>) {
    if (data) Object.assign(this, data)
  }
}
