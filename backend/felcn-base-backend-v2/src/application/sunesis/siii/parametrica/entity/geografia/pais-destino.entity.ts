import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'
import { Continente } from './continente.entity'

/**
 * Entidad PaisDestino
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: pais_destino
 */
@Entity({ name: 'pais_destino', schema: SCHEMA_PARAMETRICAS })
export class PaisDestino {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_pais_destino' })
  id: number

  @Column({ name: 'id_continente', type: 'integer' })
  idContinente: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => Continente)
  @JoinColumn({ name: 'id_continente' })
  continente: Continente
}
