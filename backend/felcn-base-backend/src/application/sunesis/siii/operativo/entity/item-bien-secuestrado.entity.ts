import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { Operativo } from './operativo.entity'
import { CatalogoTipo } from '../../parametrica/entity/operativo/catalogo-tipo.entity'

/**
 * Entidad Item Bien Secuestrado
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: item_bien_secuestrado
 */
@Entity({ name: 'item_bien_secuestrado', schema: SCHEMA_PUBLIC })
export class ItemBienSecuestrado extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_item_bien_secuestrado' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_catalogo_tipo', type: 'integer' })
  idCatalogoTipo: number

  @Column({ name: 'cantidad_bien', type: 'bigint' })
  cantidadBien: number

  @Column({ name: 'costo_aproximado', type: 'double precision', default: 0 })
  costoAproximado: number

  @Column({ name: 'costo_cuantificado', type: 'double precision', default: 0 })
  costoCuantificado: number

  @Column({ name: 'en_investigacion', type: 'boolean', default: false })
  enInvestigacion: boolean

  @Column({ name: 'foto_bien', type: 'bytea', nullable: true })
  fotoBien?: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => CatalogoTipo)
  @JoinColumn({ name: 'id_catalogo_tipo' })
  catalogoTipo?: CatalogoTipo

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<ItemBienSecuestrado>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
