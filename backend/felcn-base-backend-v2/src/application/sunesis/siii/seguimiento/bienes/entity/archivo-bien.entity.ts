import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { AsignacionSiii } from '../../../asignacion/entity/asignacion-siii.entity'
import { ContenidoBien } from '../../../parametrica/entity/bien/contenido-bien.entity'

/**
 * Entidad ArchivoBien
 * Almacena documentos adjuntos (PDFs, imágenes) de un caso vinculados a la sección de bienes.
 * El campo `data` contiene el blob binario del archivo.
 * Origen: FRM-JUR-03.aspx.cs — btnentregaarchivo_Click / Muestraarchivos / DownloadFile
 * Tabla: public.archivo_bien
 */
@Entity({ name: 'archivo_bien', schema: SCHEMA_PUBLIC })
export class ArchivoBien {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_archivo_bien' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_contenido_bien', type: 'bigint' })
  idContenidoBien: string

  @Column({ name: 'tipo', type: 'varchar', length: 15 })
  tipo: string

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 150 })
  nombreArchivo: string

  // Blob binario del archivo; excluido en listados para evitar transferencias masivas
  @Column({ name: 'data', type: 'bytea' })
  data: Buffer

  @ManyToOne(() => AsignacionSiii)
  @JoinColumn({ name: 'id_caso' })
  asignacion?: AsignacionSiii

  @ManyToOne(() => ContenidoBien)
  @JoinColumn({ name: 'id_contenido_bien' })
  contenidoBien?: ContenidoBien

  constructor(data?: Partial<ArchivoBien>) {
    if (data) Object.assign(this, data)
  }
}
