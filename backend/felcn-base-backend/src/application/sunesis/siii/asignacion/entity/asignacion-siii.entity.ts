import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad AsignacionSiii
 * Base de datos: felcn_siii
 * Schema: public
 * Tabla: asignacion
 *
 * Origen: Insert S3 (insertacasosS3 de ICIA-SERV-01, CONEXSIII)
 * Campos exactos del INSERT original:
 *   DptoAv_Id→idDepartamentoCaso, Uni_Abrev→abreviaturaUnidad,
 *   Dis_Id→idDistrital, Grp_Id→idGrupo,
 *   NroCaso→numeroCaso(''), NroCasoPerDom→numeroCasoPerDom(''),
 *   NroOperativo→numeroOperativo, CodServicio→codigoServicio,
 *   IANUS→ianus(''), NombreCaso→nombreCaso,
 *   FSolicitud→fiscalSolicitud (nombre VARCHAR, no fecha),
 *   FonoS→telefonoSolicitud, AsigCaso→asignadoCaso,
 *   FonoA→telefonoAsignado, FiscalAsigCaso→fiscalAsignadoCaso,
 *   FonoF→telefonoFiscal, Eta_Inv→idEtapaInvestigacion(7),
 *   Resultado→resultado(true), fechahoraing→fechaHoraIngreso,
 *   Usuario→usuario (pase del solicitante)
 *
 * Esta es la tabla que usa FRM-OP.aspx para muestradatos() y
 * FRM-OP-ING.aspx para muestranoaprob().
 */
@Entity({ name: 'asignacion', schema: SCHEMA_PUBLIC })
export class AsignacionSiii {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_caso' })
  idCaso: string

  @Column({ name: 'id_departamento_caso', type: 'varchar', length: 2 })
  idDepartamentoCaso: string

  @Column({ name: 'abreviatura_unidad', type: 'varchar', length: 3 })
  abreviaturaUnidad: string

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'id_grupo', type: 'integer' })
  idGrupo: number

  @Column({ name: 'letras', type: 'varchar', length: 3 })
  letras: string

  @Column({ name: 'numero_caso', type: 'varchar', length: 20 })
  numeroCaso: string

  @Column({ name: 'numero_caso_per_dom', type: 'varchar', length: 20 })
  numeroCasoPerDom: string

  @Column({ name: 'numero_operativo', type: 'varchar', length: 20 })
  numeroOperativo: string

  @Column({ name: 'codigo_servicio', type: 'varchar', length: 50 })
  codigoServicio: string

  @Column({ name: 'ianus', type: 'varchar', length: 15 })
  ianus: string

  @Column({ name: 'nombre_caso', type: 'varchar', length: 30 })
  nombreCaso: string

  // FSolicitud = nombre del fiscal/persona que solicita (NO es fecha)
  @Column({ name: 'fiscal_solicitud', type: 'varchar', length: 100 })
  fiscalSolicitud: string

  // FonoS
  @Column({ name: 'telefono_solicitud', type: 'varchar', length: 15 })
  telefonoSolicitud: string

  // AsigCaso
  @Column({ name: 'asignado_caso', type: 'varchar', length: 100 })
  asignadoCaso: string

  // FonoA
  @Column({ name: 'telefono_asignado', type: 'varchar', length: 15 })
  telefonoAsignado: string

  // FiscalAsigCaso
  @Column({ name: 'fiscal_asignado_caso', type: 'varchar', length: 70 })
  fiscalAsignadoCaso: string

  // FonoF
  @Column({ name: 'telefono_fiscal', type: 'varchar', length: 15 })
  telefonoFiscal: string

  @Column({ name: 'id_etapa_investigacion', type: 'integer', nullable: true })
  idEtapaInvestigacion?: number

  @Column({ name: 'resultado', type: 'boolean', nullable: true })
  resultado?: boolean

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  // Usuario = pase del solicitante (diferente al usuario de felcn_asignacion_caso)
  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  constructor(data?: Partial<AsignacionSiii>) {
    if (data) Object.assign(this, data)
  }
}
