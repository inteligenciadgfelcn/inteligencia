import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

export const SolicitudRegistroEstado = {
  PENDIENTE_APROBACION: 'PENDIENTE_APROBACION',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
} as const

/**
 * Solicitud de autoregistro — se crea recién cuando alguien completa el
 * formulario detallado (vía el link firmado que recibió por correo) Y no
 * hay conflicto con una cuenta real existente (mismo documento o correo).
 * El primer paso ("pedime un link") no persiste nada — ver
 * SolicitudRegistroService.solicitarAcceso: el correo viaja sellado dentro
 * de un JWT de corta duración, no en una fila de esta tabla.
 *
 * Mientras una solicitud exista solo acá, no hay ninguna cuenta capaz de
 * iniciar sesión: no existe fila en `usuario` hasta que un administrador la
 * aprueba explícitamente (ver SolicitudRegistroService.aprobar).
 */
@Entity({ name: 'solicitud_registro', schema: process.env.DB_SCHEMA_USUARIO })
export class SolicitudRegistro {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 20, default: SolicitudRegistroEstado.PENDIENTE_APROBACION })
  estado: string

  // ─── Datos autoinformados por el solicitante ────────────────────────────
  @Column({ name: 'nombres', type: 'varchar', length: 100 })
  nombres: string

  @Column({ name: 'primer_apellido', type: 'varchar', length: 100, nullable: true })
  primerApellido?: string | null

  @Column({ name: 'segundo_apellido', type: 'varchar', length: 100, nullable: true })
  segundoApellido?: string | null

  @Column({ name: 'nro_documento', type: 'varchar', length: 50 })
  nroDocumento: string

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: string

  /** Sellado desde el token del paso 1 — nunca lo escribe el solicitante directamente. */
  @Column({ name: 'correo_electronico', type: 'varchar', length: 255 })
  correoElectronico: string

  @Column({ type: 'varchar', length: 20 })
  telefono: string

  @Column({ name: 'id_grado', type: 'integer' })
  idGrado: number

  @Column({ name: 'numero_pase', type: 'varchar', length: 20 })
  numeroPase: string

  // ─── Resolución administrativa ───────────────────────────────────────────
  @Column({ name: 'fecha_resolucion', type: 'timestamp', nullable: true })
  fechaResolucion?: Date | null

  @Column({ name: 'id_admin_resolutor', type: 'bigint', nullable: true })
  idAdminResolutor?: string | null

  @Column({ name: 'comentario_rechazo', type: 'varchar', length: 500, nullable: true })
  comentarioRechazo?: string | null

  /** Se completa recién al aprobar — trazabilidad hacia la cuenta creada. */
  @Column({ name: 'id_usuario_creado', type: 'bigint', nullable: true })
  idUsuarioCreado?: string | null

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'NOW()' })
  fechaCreacion: Date
}
