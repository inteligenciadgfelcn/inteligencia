import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Tabla: public.lugar (base de datos felcn_s2i)
 * Catálogo global de lugares usado por flujo_transporte.id_lugar.
 * `descripcion` es `char(100)` en la BD (relleno con espacios) — se trimea al leer.
 */
@Entity({ name: 'lugar', schema: SCHEMA_PUBLIC })
export class S2iLugar {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id_lugar' })
  idLugar: number

  @Column({ name: 'descripcion', type: 'char', length: 100 })
  descripcion: string

  constructor(data?: Partial<S2iLugar>) {
    if (data) Object.assign(this, data)
  }
}
