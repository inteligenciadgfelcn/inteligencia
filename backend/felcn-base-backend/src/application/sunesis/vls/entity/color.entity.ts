import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'

/** Tabla: public.color (base de datos felcn_vls). Solo lectura. */
@Entity({ name: 'color', schema: SCHEMA_PUBLIC })
export class VlsColor {
  @PrimaryColumn({ name: 'id_color', type: 'integer' })
  id: number

  @Column({ name: 'nombre', type: 'text' })
  nombre: string
}
