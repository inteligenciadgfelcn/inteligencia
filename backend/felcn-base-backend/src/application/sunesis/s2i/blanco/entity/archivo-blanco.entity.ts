import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iBlanco } from './blanco.entity'
import { S2iContenidoCaso } from '../../parametrica/entity/contenido-caso.entity'

/**
 * Tabla: public.archivos_blanco
 * Documentos adjuntos al blanco investigado (actas, informes, etc.)
 * FK CASCADE a blanco — se elimina si se borra el blanco
 */
@Entity({ name: 'archivos_blanco', schema: SCHEMA_PUBLIC })
export class S2iArchivoBlanco {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_archivo' })
  idArchivo: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'id_contenido_caso', type: 'bigint' })
  idContenidoCaso: string

  /** Tipo MIME abreviado: pdf, jpg, docx, etc. (máx 15 chars) */
  @Column({ name: 'tipo', type: 'varchar', length: 15 })
  tipo: string

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 150 })
  nombreArchivo: string

  /** Contenido binario del archivo */
  @Column({ name: 'data', type: 'bytea' })
  data: Buffer

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  @ManyToOne(() => S2iContenidoCaso)
  @JoinColumn({ name: 'id_contenido_caso' })
  contenidoCaso?: S2iContenidoCaso

  constructor(data?: Partial<S2iArchivoBlanco>) {
    if (data) Object.assign(this, data)
  }
}
