import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.contenido_caso
 * Tipos de documentos adjuntos (ej. Acta de decomiso, Informe pericial)
 */
@Entity({ name: 'contenido_caso', schema: SCHEMA_PARAMETRICAS })
export class S2iContenidoCaso {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_contenido_caso' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string

  constructor(data?: Partial<S2iContenidoCaso>) {
    if (data) Object.assign(this, data)
  }
}
