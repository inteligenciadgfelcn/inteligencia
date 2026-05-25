import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'
import { S2aCatalogoClase } from './catalogo-clase.entity'

/**
 * Tabla: parametricas.catalogo_caracteristica
 * Características disponibles por clase de bien (ej. color, modelo, serie)
 * Sin identidad — PK manual
 */
@Entity({ name: 'catalogo_caracteristica', schema: SCHEMA_PARAMETRICAS })
export class S2aCatalogoCaracteristica {
  @PrimaryColumn({ type: 'integer', name: 'id_catalogo_caracteristica' })
  id: number

  @Column({ name: 'id_catalogo_clase', type: 'integer' })
  idCatalogoClase: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => S2aCatalogoClase)
  @JoinColumn({ name: 'id_catalogo_clase' })
  catalogoClase?: S2aCatalogoClase

  constructor(data?: Partial<S2aCatalogoCaracteristica>) {
    if (data) Object.assign(this, data)
  }
}
