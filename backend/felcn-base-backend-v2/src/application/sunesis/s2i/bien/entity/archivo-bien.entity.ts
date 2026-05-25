import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iItemBienInvestigado } from './item-bien-investigado.entity'
import { S2iContenidoCaso } from '../../parametrica/entity/contenido-caso.entity'

/**
 * Tabla: public.archivos_bien
 * Documentos adjuntos a un bien investigado
 * FK CASCADE a item_bien_investigado
 */
@Entity({ name: 'archivos_bien', schema: SCHEMA_PUBLIC })
export class S2iArchivoBien {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_archivo_bien' })
  idArchivoBien: string

  @Column({ name: 'id_item_bien_secundario', type: 'bigint' })
  idItemBienSecundario: string

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

  @ManyToOne(() => S2iItemBienInvestigado)
  @JoinColumn({ name: 'id_item_bien_secundario' })
  itemBienInvestigado?: S2iItemBienInvestigado

  @ManyToOne(() => S2iContenidoCaso)
  @JoinColumn({ name: 'id_contenido_caso' })
  contenidoCaso?: S2iContenidoCaso

  constructor(data?: Partial<S2iArchivoBien>) {
    if (data) Object.assign(this, data)
  }
}
