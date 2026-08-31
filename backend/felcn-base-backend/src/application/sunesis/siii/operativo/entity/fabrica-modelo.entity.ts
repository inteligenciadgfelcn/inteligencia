import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { TipoFabrica } from '../../parametrica/entity/tipo/tipo-fabrica.entity'

/**
 * Entidad Fábrica Modelo
 * Modelos/tipos de fábricas/laboratorios
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: fabrica_modelo
 */
@Entity({ name: 'fabrica_modelo', schema: SCHEMA_PUBLIC })
export class FabricaModelo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_fabrica_modelo' })
  id: number

  @Column({ name: 'id_tipo_fabrica', type: 'integer' })
  idTipoFabrica: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => TipoFabrica)
  @JoinColumn({ name: 'id_tipo_fabrica' })
  tipoFabrica?: TipoFabrica

  constructor(data?: Partial<FabricaModelo>) {
    if (data) Object.assign(this, data)
  }
}
