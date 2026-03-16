import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AccionAuditoria } from '../constant'

dotenv.config()

@Entity({ name: 'auditoria_cambio', schema: process.env.DB_SCHEMA_USUARIO })
export class AuditoriaCambio {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la auditoría de cambios',
  })
  id: string

  @Index()
  @Column({
    name: 'base_datos',
    length: 50,
    type: 'varchar',
    comment: 'Nombre de la base de datos donde ocurrió el cambio',
  })
  baseDatos: string

  @Index()
  @Column({
    name: 'schema_afectado',
    length: 50,
    type: 'varchar',
    nullable: true,
    comment: 'Schema de la base de datos afectado',
  })
  schemaAfectado?: string | null

  @Index()
  @Column({
    name: 'tabla_afectada',
    length: 50,
    type: 'varchar',
    comment: 'Nombre de la tabla afectada por el cambio',
  })
  tablaAfectada: string

  @Column({
    length: 25,
    type: 'varchar',
    comment: 'Tipo de acción realizada: INSERT, UPDATE, DELETE',
  })
  accion: string

  @Column({
    name: 'contenido_anterior',
    type: 'jsonb',
    nullable: true,
    comment: 'Contenido del registro antes del cambio (null para INSERT)',
  })
  contenidoAnterior?: Record<string, unknown> | null

  @Column({
    name: 'contenido_actual',
    type: 'jsonb',
    nullable: true,
    comment: 'Contenido del registro después del cambio (null para DELETE)',
  })
  contenidoActual?: Record<string, unknown> | null

  @Column({
    name: 'id_registro',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'ID del registro afectado',
  })
  idRegistro?: string | null

  @Index()
  @Column({
    length: 50,
    type: 'varchar',
    nullable: true,
    comment: 'Nombre de usuario que realizó el cambio',
  })
  usuario?: string | null

  @Column({
    name: 'id_usuario',
    type: 'bigint',
    nullable: true,
    comment: 'ID del usuario que realizó el cambio',
  })
  idUsuario?: string | null

  @Index()
  @CreateDateColumn({
    name: 'fecha_hora',
    type: 'timestamp without time zone',
    default: () => 'now()',
    comment: 'Fecha y hora en que se realizó el cambio',
  })
  fechaHora: Date
}
