import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

@Entity({ name: 'bitacora_login', schema: process.env.DB_SCHEMA_USUARIO })
export class BitacoraLogin {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ name: 'id_usuario', type: 'bigint', nullable: true })
  idUsuario: string

  @Column({ name: 'usuario', type: 'varchar', length: 50 })
  usuario: string

  @Column({ name: 'ip_origen', type: 'varchar', length: 45 })
  ipOrigen: string

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string

  @Column({
    name: 'metodo_autenticacion',
    type: 'varchar',
    length: 30,
    default: 'LOCAL',
  })
  metodoAutenticacion: string

  @Column({ name: 'exitoso', type: 'boolean', default: false })
  exitoso: boolean

  @Column({ name: 'motivo_fallo', type: 'varchar', length: 100, nullable: true })
  motivoFallo: string

  @Column({ name: 'session_id', type: 'varchar', length: 100, nullable: true })
  sessionId: string

  @Column({ name: 'dispositivo', type: 'varchar', length: 200, nullable: true })
  dispositivo: string

  @Column({
    name: 'fecha_hora',
    type: 'timestamp without time zone',
    default: () => 'NOW()',
  })
  fechaHora: Date
}
