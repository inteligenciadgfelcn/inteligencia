import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

/**
 * Sesiones OIDC temporales: guardan el estado de la interacción
 * desde que el auth-backend inicia el flujo hasta que se emite el code.
 */
@Entity({ name: 'ciudadania_session', schema: process.env.DB_SCHEMA_FAKE || 'fake_ciudadania' })
export class CiudadaniaSession {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** UID único de la interaction (generado al recibir /auth) */
  @Column({ name: 'interaction_uid', type: 'varchar', length: 255, unique: true })
  interactionUid: string

  /** Parámetros originales del request de autorización */
  @Column({ name: 'params', type: 'jsonb' })
  params: Record<string, string>

  /** UUID del usuario que completó el login (null hasta que valida OTP) */
  @Column({ name: 'usuario_id', type: 'uuid', nullable: true })
  usuarioId: string | null

  /**
   * Authorization code emitido tras validar OTP.
   * Hash SHA-256 del code real (el code real se devuelve solo una vez).
   */
  @Column({ name: 'code_hash', type: 'varchar', length: 255, nullable: true })
  codeHash: string | null

  /** El code ya fue canjeado por tokens */
  @Column({ name: 'code_usado', type: 'boolean', default: false })
  codeUsado: boolean

  /** Expira en 10 minutos */
  @Column({ name: 'expira_en', type: 'timestamp' })
  expiraEn: Date

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date
}
