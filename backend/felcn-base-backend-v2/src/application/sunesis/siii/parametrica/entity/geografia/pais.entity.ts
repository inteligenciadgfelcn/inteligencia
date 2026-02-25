import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'
import { Continente } from './continente.entity'

/**
 * Entidad Pais
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: pais
 */
@Entity({ name: 'pais', schema: SCHEMA_PARAMETRICAS })
export class Pais {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_pais' })
  id: number

  @Column({ name: 'id_continente', type: 'integer' })
  idContinente: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => Continente)
  @JoinColumn({ name: 'id_continente' })
  continente: Continente
}
