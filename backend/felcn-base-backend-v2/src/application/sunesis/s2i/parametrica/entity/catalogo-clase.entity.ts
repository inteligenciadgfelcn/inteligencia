import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'
import { S2iBien } from './bien.entity'

/**
 * Tabla: parametricas.catalogo_clase
 * Nivel 2 de jerarquía de bienes: bien → clase
 * Sin identidad — PK manual
 */
@Entity({ name: 'catalogo_clase', schema: SCHEMA_PARAMETRICAS })
export class S2aCatalogoClase {
  @PrimaryColumn({ type: 'integer', name: 'id_catalogo_clase' })
  id: number

  @Column({ name: 'id_bien', type: 'integer' })
  idBien: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'es_fungible', type: 'boolean' })
  esFungible: boolean

  @ManyToOne(() => S2iBien)
  @JoinColumn({ name: 'id_bien' })
  bien?: S2iBien

  constructor(data?: Partial<S2aCatalogoClase>) {
    if (data) Object.assign(this, data)
  }
}
