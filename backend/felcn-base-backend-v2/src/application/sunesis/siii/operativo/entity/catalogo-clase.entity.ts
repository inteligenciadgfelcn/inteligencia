import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad Catálogo Clase
 * Clasificación de bienes
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: catalogo_clase
 */
@Entity({ name: 'catalogo_clase', schema: SCHEMA_PUBLIC })
export class CatalogoClase {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_catalogo_clase' })
  id: number

  @Column({ name: 'id_bien', type: 'integer' })
  idBien: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'es_fungible', type: 'boolean', nullable: true })
  esFungible?: boolean

  constructor(data?: Partial<CatalogoClase>) {
    if (data) Object.assign(this, data)
  }
}
