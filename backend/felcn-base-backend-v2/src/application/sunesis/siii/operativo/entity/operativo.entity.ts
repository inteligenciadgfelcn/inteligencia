import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BaseEntity } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad Operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: operativo
 */
@Entity({ name: 'operativo', schema: SCHEMA_PUBLIC })
export class Operativo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_operativo' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'id_tipo_relevancia', type: 'integer' })
  idTipoRelevancia: number

  @Column({ name: 'numero_operativo', type: 'varchar', length: 20 })
  numeroOperativo: string

  @Column({ name: 'id_tipo_denuncia', type: 'integer', nullable: true })
  idTipoDenuncia?: number

  @Column({ name: 'id_tipo_penal', type: 'integer', nullable: true })
  idTipoPenal?: number

  @Column({ name: 'fecha_operativo', type: 'timestamp' })
  fechaOperativo: Date

  @Column({ name: 'id_departamento', type: 'integer' })
  idDepartamento: number

  @Column({ name: 'id_provincia', type: 'integer' })
  idProvincia: number

  @Column({ name: 'id_localidad', type: 'integer' })
  idLocalidad: number

  @Column({ name: 'lugar', type: 'varchar', length: 255 })
  lugar: string

  @Column({ name: 'id_categoria_operativo', type: 'integer' })
  idCategoriaOperativo: number

  @Column({ name: 'id_item_operativo', type: 'integer' })
  idItemOperativo: number

  @Column({ name: 'id_unidad', type: 'integer' })
  idUnidad: number

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'id_grupo', type: 'integer' })
  idGrupo: number

  @Column({ name: 'mando', type: 'varchar', length: 150 })
  mando: string

  // Coordenadas GIS (decimal — el frontend convierte DMS si aplica)
  @Column({ name: 'coord_x', type: 'double precision' })
  coordX: number

  @Column({ name: 'coord_y', type: 'double precision' })
  coordY: number

  @Column({ name: 'id_plan_operacion', type: 'integer' })
  idPlanOperacion: number

  @Column({ name: 'breve_detalle', type: 'text', nullable: true })
  breveDetalle?: string

  @Column({ name: 'descripcion', type: 'text' })
  descripcion: string

  @Column({ name: 'id_tipo_operacion', type: 'integer' })
  idTipoOperacion: number

  @Column({ name: 'organizacion', type: 'varchar', length: 50 })
  organizacion: string

  @Column({
    name: 'clan_familiar',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  clanFamiliar?: string

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

  constructor(data?: Partial<Operativo>) {
    super()
    if (data) Object.assign(this, data)
  }
}
