import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AsignacionSiii } from '../../../asignacion/entity/asignacion-siii.entity'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { ContenidoCaso } from '../../../parametrica/entity/bien/contenido-caso.entity'

/**
 * Entidad Archivo
 * Almacena los documentos adjuntos (PDFs, imágenes) de un caso en formato binario.
 * Tabla: archivo
 */
@Entity({ name: 'archivo', schema: SCHEMA_PUBLIC })
export class Archivo {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_archivo' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_contenido_caso', type: 'bigint' })
  idContenidoCaso: string

  @Column({ name: 'tipo', type: 'varchar', length: 15 })
  tipo: string

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 150 })
  nombreArchivo: string

  @Column({ name: 'data', type: 'bytea' })
  data: Buffer

  @ManyToOne(() => AsignacionSiii)
  @JoinColumn({ name: 'id_caso' })
  asignacion: AsignacionSiii

  @ManyToOne(() => ContenidoCaso)
  @JoinColumn({ name: 'id_contenido_caso' })
  contenidoCaso: ContenidoCaso

  constructor(data?: Partial<Archivo>) {
    if (data) Object.assign(this, data)
  }
}
