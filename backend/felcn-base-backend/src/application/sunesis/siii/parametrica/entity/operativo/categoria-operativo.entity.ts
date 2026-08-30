import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'categoria_operativo', schema: SCHEMA_PARAMETRICAS })
export class CategoriaOperativo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_categoria_operativo' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
