import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad ContenidoCaso
 * Base de datos: felcn_s3i
 * Tabla: contenido_caso
 */
@Entity({ name: 'contenido_caso' })
export class ContenidoCaso {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_contenido_caso' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
