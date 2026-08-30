import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'sustancia_solida_descripcion', schema: SCHEMA_PARAMETRICAS })
export class SustanciaSolidaDescripcion {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id_sustancia_solida_descripcion',
  })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
