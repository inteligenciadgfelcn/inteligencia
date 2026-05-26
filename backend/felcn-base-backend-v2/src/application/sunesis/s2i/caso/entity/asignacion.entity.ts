import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iPais } from '../../parametrica/entity/pais.entity'
import { S2iEstadoCaso } from '../../parametrica/entity/estado-caso.entity'
import { S2iEtapaInvestigacion } from '../../parametrica/entity/etapa-investigacion.entity'

/**
 * Tabla: public.asignacion
 * Caso de investigación — entidad raíz del módulo S2I
 * Equivalente al formulario FRM-ING-C0 del sistema legado
 */
@Entity({ name: 'asignacion', schema: SCHEMA_PUBLIC })
export class S2iAsignacion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_caso' })
  idCaso: string

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'lugar', type: 'varchar', length: 50 })
  lugar: string

  @Column({ name: 'nombre_caso', type: 'varchar', length: 50 })
  nombreCaso: string

  @Column({ name: 'palabra_clave', type: 'varchar', length: 20 })
  palabraClave: string

  @Column({ name: 'id_estado_caso', type: 'integer' })
  idEstadoCaso: number

  @Column({ name: 'nro_caso_cer', type: 'varchar', length: 20 })
  nroCasoCer: string

  @Column({ name: 'id_etapa_investigacion', type: 'integer' })
  idEtapaInvestigacion: number

  @Column({ name: 'fecha_inicio', type: 'timestamp' })
  fechaInicio: Date

  @Column({ name: 'antecedentes', type: 'text' })
  antecedentes: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iPais)
  @JoinColumn({ name: 'id_pais' })
  pais?: S2iPais

  @ManyToOne(() => S2iEstadoCaso)
  @JoinColumn({ name: 'id_estado_caso' })
  estadoCaso?: S2iEstadoCaso

  @ManyToOne(() => S2iEtapaInvestigacion)
  @JoinColumn({ name: 'id_etapa_investigacion' })
  etapaInvestigacion?: S2iEtapaInvestigacion

  constructor(data?: Partial<S2iAsignacion>) {
    if (data) Object.assign(this, data)
  }
}
