import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'
import { S2aCatalogoClase } from './catalogo-clase.entity'

/**
 * Tabla: parametricas.catalogo_tipo
 * Nivel 3 de jerarquía de bienes: bien → clase → tipo
 * Sin identidad — PK manual
 */
@Entity({ name: 'catalogo_tipo', schema: SCHEMA_PARAMETRICAS })
export class S2aCatalogoTipo {
  @PrimaryColumn({ type: 'integer', name: 'id_catalogo_tipo' })
  id: number

  @Column({ name: 'id_catalogo_clase', type: 'integer' })
  idCatalogoClase: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => S2aCatalogoClase)
  @JoinColumn({ name: 'id_catalogo_clase' })
  catalogoClase?: S2aCatalogoClase

  constructor(data?: Partial<S2aCatalogoTipo>) {
    if (data) Object.assign(this, data)
  }
}
