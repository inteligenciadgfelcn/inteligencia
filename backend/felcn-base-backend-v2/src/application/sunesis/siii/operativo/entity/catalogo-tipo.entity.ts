import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { CatalogoClase } from './catalogo-clase.entity'

/**
 * Entidad Catálogo Tipo
 * Tipos de bienes dentro de una clase
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: catalogo_tipo
 */
@Entity({ name: 'catalogo_tipo', schema: SCHEMA_PUBLIC })
export class CatalogoTipo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_catalogo_tipo' })
  id: number

  @Column({ name: 'id_catalogo_clase', type: 'integer' })
  idCatalogoClase: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => CatalogoClase)
  @JoinColumn({ name: 'id_catalogo_clase' })
  catalogoClase?: CatalogoClase

  constructor(data?: Partial<CatalogoTipo>) {
    if (data) Object.assign(this, data)
  }
}
