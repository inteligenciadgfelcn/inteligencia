import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tipo_droga', schema: SCHEMA_PARAMETRICAS })
export class TipoDroga {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tipo_droga' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'lista', type: 'varchar', length: 3 })
  lista: string

  @Column({ name: 'tipo', type: 'varchar', length: 15 })
  tipo: string

  @Column({ name: 'es_medicamento', type: 'boolean', nullable: true })
  esMedicamento?: boolean

  @Column({ name: 'es_ds', type: 'boolean', nullable: true })
  esDs?: boolean
}
