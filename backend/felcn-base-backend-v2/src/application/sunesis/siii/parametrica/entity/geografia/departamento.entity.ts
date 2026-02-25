import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'
import { Pais } from './pais.entity'

/**
 * Entidad Departamento
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: departamento
 */
@Entity({ name: 'departamento', schema: SCHEMA_PARAMETRICAS })
export class Departamento {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_departamento' })
  id: number

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => Pais)
  @JoinColumn({ name: 'id_pais' })
  pais: Pais
}
