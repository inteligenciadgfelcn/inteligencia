import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { CiudadaniaUsuario } from './ciudadania-usuario.entity'

/**
 * OTPs generados durante el flujo de verificación.
 * Expiran a los 150 segundos (igual que el proveedor real).
 */
@Entity({ name: 'ciudadania_otp', schema: process.env.DB_SCHEMA_FAKE || 'fake_ciudadania' })
export class CiudadaniaOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => CiudadaniaUsuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: CiudadaniaUsuario

  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string

  /** UID de la interaction OIDC — vincula el OTP con la sesión */
  @Column({ name: 'interaction_uid', type: 'varchar', length: 255 })
  interactionUid: string

  /** Código de 6 dígitos */
  @Column({ type: 'varchar', length: 6 })
  codigo: string

  /** 150 segundos desde la creación */
  @Column({ name: 'expira_en', type: 'timestamp' })
  expiraEn: Date

  @Column({ type: 'boolean', default: false })
  usado: boolean

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date
}
