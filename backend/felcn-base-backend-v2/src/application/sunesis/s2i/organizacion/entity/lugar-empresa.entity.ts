import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iEmpresa } from './empresa.entity'

/**
 * Tabla: public.lugar_empresa
 * Ubicaciones GIS asociadas a una organización investigada
 * FK CASCADE a empresa
 */
@Entity({ name: 'lugar_empresa', schema: SCHEMA_PUBLIC })
export class S2iLugarEmpresa {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_lugar_empresa' })
  idLugarEmpresa: string

  @Column({ name: 'id_empresa', type: 'bigint' })
  idEmpresa: string

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string

  @Column({ name: 'coordenas_x', type: 'double precision' })
  coordenadasX: number

  @Column({ name: 'coordenas_y', type: 'double precision' })
  coordenadasY: number

  @Column({ name: 'contenido', type: 'text' })
  contenido: string

  @ManyToOne(() => S2iEmpresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: S2iEmpresa

  constructor(data?: Partial<S2iLugarEmpresa>) {
    if (data) Object.assign(this, data)
  }
}
