import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iEmpresa } from './empresa.entity'
import { S2iContenidoCaso } from '../../parametrica/entity/contenido-caso.entity'

/**
 * Tabla: public.archivos_organizacion
 * Documentos adjuntos a una organización investigada
 * FK CASCADE a empresa
 */
@Entity({ name: 'archivos_organizacion', schema: SCHEMA_PUBLIC })
export class S2iArchivoOrganizacion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_archivo' })
  idArchivo: string

  @Column({ name: 'id_empresa', type: 'bigint' })
  idEmpresa: string

  @Column({ name: 'id_contenido_caso', type: 'bigint' })
  idContenidoCaso: string

  /** Tipo MIME abreviado: pdf, jpg, docx, etc. (máx 15 chars) */
  @Column({ name: 'tipo', type: 'varchar', length: 15 })
  tipo: string

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 150 })
  nombreArchivo: string

  @Column({ name: 'data', type: 'bytea' })
  data: Buffer

  @ManyToOne(() => S2iEmpresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa?: S2iEmpresa

  @ManyToOne(() => S2iContenidoCaso)
  @JoinColumn({ name: 'id_contenido_caso' })
  contenidoCaso?: S2iContenidoCaso

  constructor(data?: Partial<S2iArchivoOrganizacion>) {
    if (data) Object.assign(this, data)
  }
}
