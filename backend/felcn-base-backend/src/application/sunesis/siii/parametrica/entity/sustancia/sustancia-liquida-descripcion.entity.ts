import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'sustancia_liquida_descripcion', schema: SCHEMA_PARAMETRICAS })
export class SustanciaLiquidaDescripcion {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id_sustancia_liquida_descripcion',
  })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
