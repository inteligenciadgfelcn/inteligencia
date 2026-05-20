import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

/**
 * Tabla temporal de usuarios fake de Ciudadanía Digital.
 * Se elimina junto con el schema fake_ciudadania cuando se retire el fake.
 */
@Entity({ name: 'ciudadania_usuario', schema: process.env.DB_SCHEMA_FAKE || 'fake_ciudadania' })
export class CiudadaniaUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Número de CI/CIE — es el campo "login" en el formulario */
  @Column({ type: 'varchar', length: 20, unique: true })
  ci: string

  /** Hash bcrypt de la contraseña */
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255 })
  nombres: string

  @Column({ name: 'primer_apellido', type: 'varchar', length: 255 })
  primerApellido: string

  @Column({ name: 'segundo_apellido', type: 'varchar', length: 255, nullable: true })
  segundoApellido: string | null

  /**
   * Formato DD/MM/YYYY — se devuelve así en el endpoint /userinfo
   * porque la estrategia OIDC lo parsea con dayjs('DD/MM/YYYY')
   */
  @Column({ name: 'fecha_nacimiento', type: 'varchar', length: 10 })
  fechaNacimiento: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string | null

  @Column({ name: 'tipo_documento', type: 'varchar', length: 10, default: 'CI' })
  tipoDocumento: string

  @Column({ type: 'varchar', length: 20, default: 'ACTIVO' })
  estado: string

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date
}
