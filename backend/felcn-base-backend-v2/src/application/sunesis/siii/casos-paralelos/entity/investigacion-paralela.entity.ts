import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AsignacionSiii } from '../../asignacion/entity/asignacion-siii.entity'
import { Operativo } from '../../operativo/entity/operativo.entity'
import { DepartamentoCaso } from '../../parametrica/entity/geografia/departamento-caso.entity'
import { Unidad } from '../../parametrica/entity/estructura/unidad.entity'
import { Distrital } from '../../parametrica/entity/estructura/distrital.entity'
import { Grupo } from '../../parametrica/entity/estructura/grupo.entity'

/**
 * Entidad InvestigacionParalela
 * Base de datos: felcn_siii
 * Schema: public
 * Tabla: investigacion_paralela
 */
@Entity({ name: 'investigacion_paralela', schema: SCHEMA_PUBLIC })
export class InvestigacionParalela extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_investigacion_paralela' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_departamento_caso', type: 'varchar', length: 2 })
  idDepartamentoCaso: string

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'id_grupo', type: 'integer' })
  idGrupo: number

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'abreviatura_unidad', type: 'varchar', length: 3 })
  abreviaturaUnidad: string

  @Column({ name: 'delito', type: 'varchar', length: 35 })
  delito: string

  @Column({ name: 'numero_caso', type: 'varchar', length: 20 })
  numeroCaso: string

  @Column({ name: 'asignado_caso', type: 'varchar', length: 100 })
  asignadoCaso: string

  @Column({ name: 'fiscal_asignado_caso', type: 'varchar', length: 70 })
  fiscalAsignadoCaso: string

  @Column({ name: 'delito_precedente', type: 'text' })
  delitoPrecedente: string

  @Column({ name: 'informe', type: 'text' })
  informe: string

  @Column({ name: 'fecha_envio_investigacion_paralela', type: 'timestamp' })
  fechaEnvioInvestigacionParalela: Date

  @Column({ name: 'resultado', type: 'boolean' })
  resultado: boolean

  @Column({
    name: 'fecha_respuesta_investigacion_paralela',
    type: 'timestamp',
    nullable: true,
  })
  fechaRespuestaInvestigacionParalela?: Date

  @Column({ name: 'respuesta_investigacion_paralela', type: 'boolean' })
  respuestaInvestigacionParalela: boolean

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  // ==================== RELACIONES ====================

  @ManyToOne(() => AsignacionSiii)
  @JoinColumn({ name: 'id_caso' })
  asignacion: AsignacionSiii

  @ManyToOne(() => DepartamentoCaso)
  @JoinColumn({ name: 'id_departamento_caso' })
  departamento: DepartamentoCaso

  @ManyToOne(() => Distrital)
  @JoinColumn({ name: 'id_distrital' })
  distrital: Distrital

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo: Operativo

  @ManyToOne(() => Unidad)
  @JoinColumn({ name: 'abreviatura_unidad', referencedColumnName: 'abreviatura' })
  unidad: Unidad

  constructor(data?: Partial<InvestigacionParalela>) {
    super()
    if (data) Object.assign(this, data)
  }
}
