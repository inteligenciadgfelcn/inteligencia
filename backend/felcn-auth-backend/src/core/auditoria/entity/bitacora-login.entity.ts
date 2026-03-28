import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { MetodoAutenticacion, MotivoFalloLogin } from '../constant'

dotenv.config()

@Entity({ name: 'bitacora_login', schema: process.env.DB_SCHEMA_USUARIO })
export class BitacoraLogin {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la bitácora de inicio de sesión',
  })
  id: string

  @Index()
  @Column({
    name: 'id_usuario',
    type: 'bigint',
    nullable: true,
    comment: 'ID del usuario que intentó iniciar sesión (null si usuario no existe)',
  })
  idUsuario?: string | null

  @Column({
    length: 50,
    type: 'varchar',
    nullable: true,
    comment: 'Nombre de usuario utilizado en el intento de login',
  })
  usuario?: string | null

  @Index()
  @Column({
    name: 'ip_origen',
    length: 45,
    type: 'varchar',
    nullable: true,
    comment: 'Dirección IP de origen (IPv4 o IPv6)',
  })
  ipOrigen?: string | null

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
    comment: 'Cadena User-Agent del navegador/cliente',
  })
  userAgent?: string | null

  @Column({
    name: 'metodo_autenticacion',
    length: 30,
    type: 'varchar',
    default: MetodoAutenticacion.LOCAL,
    comment: 'Método de autenticación utilizado: LOCAL, CIUDADANIA_DIGITAL, KEYCLOAK, 2FA',
  })
  metodoAutenticacion: string

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si el inicio de sesión fue exitoso',
  })
  exitoso: boolean

  @Column({
    name: 'motivo_fallo',
    length: 100,
    type: 'varchar',
    nullable: true,
    comment: 'Motivo del fallo de autenticación',
  })
  motivoFallo?: string | null

  @Column({
    name: 'session_id',
    length: 100,
    type: 'varchar',
    nullable: true,
    comment: 'Identificador de la sesión creada tras login exitoso',
  })
  sessionId?: string | null

  @Column({
    name: 'dispositivo',
    length: 200,
    type: 'varchar',
    nullable: true,
    comment: 'Información del dispositivo parseada del User-Agent',
  })
  dispositivo?: string | null

  @Index()
  @CreateDateColumn({
    name: 'fecha_hora',
    type: 'timestamp without time zone',
    default: () => 'now()',
    comment: 'Fecha y hora del intento de inicio de sesión',
  })
  fechaHora: Date
}
