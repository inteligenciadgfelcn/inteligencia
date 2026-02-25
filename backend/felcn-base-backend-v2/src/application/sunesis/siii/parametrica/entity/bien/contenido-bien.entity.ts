import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'contenido_bien', schema: SCHEMA_PARAMETRICAS })
export class ContenidoBien {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_contenido_bien' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
