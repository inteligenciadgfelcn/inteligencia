import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'
import { S2iContinente } from './continente.entity'

/**
 * Tabla: parametricas.pais
 * Catálogo de países — FK a continente
 */
@Entity({ name: 'pais', schema: SCHEMA_PARAMETRICAS })
export class S2iPais {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_pais' })
  id: number

  @Column({ name: 'id_continente', type: 'integer' })
  idContinente: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => S2iContinente)
  @JoinColumn({ name: 'id_continente' })
  continente?: S2iContinente

  constructor(data?: Partial<S2iPais>) {
    if (data) Object.assign(this, data)
  }
}
