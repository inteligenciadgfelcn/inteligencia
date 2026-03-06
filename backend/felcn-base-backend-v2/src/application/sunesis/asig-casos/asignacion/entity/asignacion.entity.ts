import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm'
import { DepartamentoCaso } from '../../lookup/entity/departamento-caso.entity'
import { UnidadCaso } from '../../lookup/entity/unidad-caso.entity'
import { Letra } from '../../lookup/entity/letra.entity'
import { Servicio } from '../../servicio/entity/servicio.entity'

/**
 * Entidad Asignacion (Caso)
 * Base de datos: felcn_asignacion_caso
 * Tabla: asignacion
 * Script: database/scripts/felcn_asignacion_caso.sql
 *
 * Campos del formulario original FRM-OP.aspx (muestradatos):
 * Insert S2 (insertacasosS2 de ICIA-SERV-01):
 *   DptoAv_Id→idDepartamento, UnidAV_Id→idUnidad, Letras→codigoLetra('PD'),
 *   NroCaso→numeroCaso(''), NroOperativo→numeroOperativo,
 *   FechaOperativo→fechaOperativo, NombreCaso→nombreCaso,
 *   AsigCaso→asignacionCaso, CodServicio→codigoServicio,
 *   FiscalAsigCaso→fiscalAsignado, fechahoraing→fechaHoraRegistro, Usuario→usuarioLogin
 *
 * NOTA: Dis_Id, Grp_Id, FSolicitud, FonoS, FonoA, FonoF NO están en esta tabla.
 * Esos campos se insertan en felcn_siii.public.asignacion (Insert S3 / insertacasosS3).
 */
@Entity({ name: 'asignacion' })
export class Asignacion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_asignacion' })
  idAsignacion: string

  @Column({ name: 'id_departamento', type: 'char', length: 2 })
  idDepartamento: string

  @Column({ name: 'id_unidad', type: 'char', length: 2 })
  idUnidad: string

  @Column({ name: 'codigo_letra', type: 'char', length: 3 })
  codigoLetra: string

  @Column({ name: 'numero_caso', type: 'varchar', length: 20 })
  numeroCaso: string

  @Column({ name: 'numero_operativo', type: 'varchar', length: 20 })
  numeroOperativo: string

  @Column({ name: 'fecha_operativo', type: 'timestamp', nullable: true })
  fechaOperativo?: Date

  @Column({ name: 'nombre_caso', type: 'varchar', length: 30 })
  nombreCaso: string

  @Column({ name: 'asignacion_caso', type: 'varchar', length: 70 })
  asignacionCaso: string

  @Column({ name: 'codigo_servicio', type: 'varchar', length: 50 })
  codigoServicio: string

  @Column({ name: 'fiscal_asignado', type: 'varchar', length: 70 })
  fiscalAsignado: string

  @Column({ name: 'fecha_hora_registro', type: 'timestamp' })
  fechaHoraRegistro: Date

  @Column({ name: 'usuario_login', type: 'char', length: 15 })
  usuarioLogin: string

  // Relaciones
  @ManyToOne(() => DepartamentoCaso)
  @JoinColumn({ name: 'id_departamento' })
  departamento: DepartamentoCaso

  @ManyToOne(() => UnidadCaso)
  @JoinColumn({ name: 'id_unidad' })
  unidad: UnidadCaso

  @ManyToOne(() => Letra)
  @JoinColumn({ name: 'codigo_letra' })
  letra: Letra

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'codigo_servicio' })
  servicio: Servicio

  @BeforeInsert()
  insertarFechaRegistro() {
    if (!this.fechaHoraRegistro) {
      this.fechaHoraRegistro = new Date()
    }
  }

  constructor(data?: Partial<Asignacion>) {
    if (data) Object.assign(this, data)
  }
}
