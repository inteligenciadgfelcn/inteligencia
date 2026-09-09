import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'
import { Provincia } from './provincia.entity'

/**
 * Entidad Localidad
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: localidad
 */
@Entity({ name: 'localidad', schema: SCHEMA_PARAMETRICAS })
export class Localidad {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_localidad' })
  id: number

  @Column({ name: 'id_provincia', type: 'integer' })
  idProvincia: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => Provincia)
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia
}
