import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iTipoOrganizacion } from '../../parametrica/entity/tipo-organizacion.entity'

/**
 * Tabla: public.empresa
 * Organización o empresa investigada vinculada a un caso
 * Equivalente a la tabla Empresas del sistema legado
 */
@Entity({ name: 'empresa', schema: SCHEMA_PUBLIC })
export class S2iEmpresa {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_empresa' })
  idEmpresa: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_tipo_organizacion', type: 'integer' })
  idTipoOrganizacion: number

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre: string

  @Column({ name: 'nit', type: 'varchar', length: 30 })
  nit: string

  @Column({ name: 'matricula', type: 'varchar', length: 30 })
  matricula: string

  @Column({ name: 'representante', type: 'varchar', length: 100 })
  representante: string

  @Column({ name: 'observaciones', type: 'text' })
  observaciones: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iTipoOrganizacion)
  @JoinColumn({ name: 'id_tipo_organizacion' })
  tipoOrganizacion?: S2iTipoOrganizacion

  constructor(data?: Partial<S2iEmpresa>) {
    if (data) Object.assign(this, data)
  }
}
