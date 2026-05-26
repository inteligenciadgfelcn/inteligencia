import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC, SCHEMA_PARAMETRICAS } from '../../../shared/constants'
import { S2iBlanco } from './blanco.entity'
import { S2iTipoDelito } from '../../parametrica/entity/tipo-delito.entity'
import { S2iPais } from '../../parametrica/entity/pais.entity'

/**
 * Tabla: public.antecedente_blanco
 * Antecedentes penales del blanco investigado
 * FK CASCADE a blanco — se elimina automáticamente si se borra el blanco
 */
@Entity({ name: 'antecedente_blanco', schema: SCHEMA_PUBLIC })
export class S2iAntecedenteBlanco {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_antecedente' })
  idAntecedente: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'id_tipo_delito', type: 'integer' })
  idTipoDelito: number

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'lugar_hecho', type: 'varchar', length: 100 })
  lugarHecho: string

  @Column({ name: 'nro_caso', type: 'varchar', length: 20 })
  nroCaso: string

  @Column({ name: 'fecha_hecho', type: 'timestamp' })
  fechaHecho: Date

  @Column({ name: 'hecho', type: 'text' })
  hecho: string

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  @ManyToOne(() => S2iTipoDelito)
  @JoinColumn({ name: 'id_tipo_delito' })
  tipoDelito?: S2iTipoDelito

  @ManyToOne(() => S2iPais)
  @JoinColumn({ name: 'id_pais' })
  pais?: S2iPais

  constructor(data?: Partial<S2iAntecedenteBlanco>) {
    if (data) Object.assign(this, data)
  }
}
