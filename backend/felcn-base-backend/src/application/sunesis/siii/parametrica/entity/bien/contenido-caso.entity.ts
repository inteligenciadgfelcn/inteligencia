import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'contenido_caso', schema: SCHEMA_PARAMETRICAS })
export class ContenidoCaso {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_contenido_caso' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string
}
