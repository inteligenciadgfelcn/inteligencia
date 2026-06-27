import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

@Entity({ name: 'otp_sesion', schema: process.env.DB_SCHEMA_USUARIO })
export class OtpSesion {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'id_usuario', type: 'bigint' })
  idUsuario: string

  @Column({ name: 'codigo_hash', type: 'varchar', length: 255 })
  codigoHash: string

  @Column({ type: 'varchar', length: 20 })
  canal: string

  @Column({ type: 'varchar', length: 255 })
  destino: string

  @Column({ type: 'integer', default: 0 })
  intentos: number

  @Column({ type: 'boolean', default: false })
  consumido: boolean

  @Column({ type: 'timestamptz' })
  expiracion: Date

  @Column({
    name: 'fecha_creacion',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  fechaCreacion: Date
}
