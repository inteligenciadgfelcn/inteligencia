import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad AuditoriaCambio
 * Base de datos: felcn_s3i
 * Tabla: auditoria_cambio
 */
@Entity({ name: 'auditoria_cambio' })
export class AuditoriaCambio {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_auditoria' })
  id: string

  @Column({ name: 'base_datos', type: 'varchar', length: 25 })
  baseDatos: string

  @Column({ name: 'tabla_afectada', type: 'varchar', length: 25 })
  tablaAfectada: string

  @Column({ name: 'accion', type: 'varchar', length: 25 })
  accion: string

  @Column({ name: 'contenido_anterior', type: 'text' })
  contenidoAnterior: string

  @Column({ name: 'contenido_actual', type: 'text' })
  contenidoActual: string

  @Column({ name: 'contenido_encriptado', type: 'text' })
  contenidoEncriptado: string

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string
}
