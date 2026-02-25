import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'
import { Departamento } from './departamento.entity'

/**
 * Entidad Provincia
 * Base de datos: felcn_iii
 * Schema: parametricas
 * Tabla: provincia
 */
@Entity({ name: 'provincia', schema: SCHEMA_PARAMETRICAS })
export class Provincia {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_provincia' })
  id: number

  @Column({ name: 'id_departamento', type: 'integer' })
  idDepartamento: number

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @ManyToOne(() => Departamento)
  @JoinColumn({ name: 'id_departamento' })
  departamento: Departamento
}
