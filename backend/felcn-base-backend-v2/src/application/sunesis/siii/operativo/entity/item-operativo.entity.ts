import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad Item Operativo
 * Subcategorías de operativos
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: item_operativo
 */
@Entity({ name: 'item_operativo', schema: SCHEMA_PUBLIC })
export class ItemOperativo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_item_operativo' })
  id: number

  @Column({ name: 'id_categoria_operativo', type: 'integer' })
  idCategoriaOperativo: number

  @Column({ name: 'descripcion', type: 'varchar', length: 90 })
  descripcion: string

  constructor(data?: Partial<ItemOperativo>) {
    if (data) Object.assign(this, data)
  }
}
