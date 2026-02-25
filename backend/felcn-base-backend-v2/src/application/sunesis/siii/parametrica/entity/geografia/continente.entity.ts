import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

/**
 * Entidad Continente
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: continente
 */
@Entity({ name: 'continente', schema: SCHEMA_PARAMETRICAS })
export class Continente {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_continente' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
