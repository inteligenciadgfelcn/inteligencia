import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'

/** Tabla: public.modelo (base de datos felcn_vls). Solo lectura. */
@Entity({ name: 'modelo', schema: SCHEMA_PUBLIC })
export class VlsModelo {
  @PrimaryColumn({ name: 'id_modelo', type: 'integer' })
  id: number

  @Column({ name: 'nombre', type: 'text' })
  nombre: string
}
