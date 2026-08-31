import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'

/** Tabla: public.clase (base de datos felcn_vls). Solo lectura. */
@Entity({ name: 'clase', schema: SCHEMA_PUBLIC })
export class VlsClase {
  @PrimaryColumn({ name: 'id_clase', type: 'integer' })
  id: number

  @Column({ name: 'nombre', type: 'text' })
  nombre: string
}
