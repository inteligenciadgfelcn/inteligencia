import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'

/**
 * Entidad DepartamentoCaso
 * Base de datos: felcn_siii
 * Schema: public
 * Tabla: departamento_caso
 */
@Entity({ name: 'departamento_caso', schema: SCHEMA_PUBLIC })
export class DepartamentoCaso {
  @PrimaryColumn({ name: 'id_departamento_caso', type: 'varchar', length: 2 })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
