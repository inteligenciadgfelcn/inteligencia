import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

@Entity({ name: 'historial_contrasena', schema: process.env.DB_SCHEMA_USUARIO })
export class HistorialContrasena {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla HistorialContrasena',
  })
  id: string

  @Column({
    name: 'id_usuario',
    type: 'bigint',
    comment: 'Usuario dueño de esta contraseña histórica',
  })
  idUsuario: string

  @Column({
    name: 'contrasena',
    type: 'varchar',
    length: 255,
    comment: 'Hash bcrypt de una contraseña que el usuario tuvo en el pasado',
  })
  contrasena: string

  @CreateDateColumn({
    name: '_fecha_creacion',
    type: 'timestamp without time zone',
    default: () => 'now()',
    comment: 'Fecha en que esta contraseña dejó de estar vigente',
  })
  fechaCreacion: Date

  constructor(data?: Partial<HistorialContrasena>) {
    if (data) Object.assign(this, data)
  }
}
