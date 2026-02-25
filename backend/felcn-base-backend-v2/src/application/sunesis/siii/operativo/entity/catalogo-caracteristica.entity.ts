import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { CatalogoClase } from './catalogo-clase.entity'

/**
 * Entidad Catálogo Característica
 * Características de bienes por clase
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: catalogo_caracteristica
 */
@Entity({ name: 'catalogo_caracteristica', schema: SCHEMA_PUBLIC })
export class CatalogoCaracteristica {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_catalogo_caracteristica' })
  id: number

  @Column({ name: 'id_catalogo_clase', type: 'integer' })
  idCatalogoClase: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => CatalogoClase)
  @JoinColumn({ name: 'id_catalogo_clase' })
  catalogoClase?: CatalogoClase

  constructor(data?: Partial<CatalogoCaracteristica>) {
    if (data) Object.assign(this, data)
  }
}
