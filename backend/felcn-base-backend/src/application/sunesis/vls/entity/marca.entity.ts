import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'

/** Tabla: public.marca (base de datos felcn_vls). Solo lectura. */
@Entity({ name: 'marca', schema: SCHEMA_PUBLIC })
export class VlsMarca {
  @PrimaryColumn({ name: 'id_marca', type: 'integer' })
  id: number

  @Column({ name: 'nombre', type: 'text' })
  nombre: string
}
