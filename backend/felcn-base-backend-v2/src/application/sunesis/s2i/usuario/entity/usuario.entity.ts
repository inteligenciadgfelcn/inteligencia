import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Grado } from '../../estructura/entity/grado.entity'
import { Grupo } from '../../estructura/entity/grupo.entity'

/**
 * Entidad Usuario
 * Base de datos: felcn_s2i
 * Tabla: usuario
 * Script: database/scripts/felcn_s2i.sql
 */
@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_usuario' })
  idUsuario: string

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 50 })
  nombreUsuario: string

  @Column({ name: 'usuario_login', type: 'varchar', length: 15 })
  usuarioLogin: string

  @Column({ name: 'contrasena', type: 'varchar', length: 255 })
  contrasena: string

  @Column({ name: 'id_grado', type: 'integer' })
  idGrado: number

  @Column({ name: 'nombre_app', type: 'varchar', length: 200 })
  nombreApp: string

  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string

  @Column({ name: 'telefono_celular', type: 'varchar', length: 20 })
  telefonoCelular: string

  @Column({ name: 'telefono_corporativo', type: 'varchar', length: 20 })
  telefonoCorporativo: string

  @Column({ name: 'id_grupo', type: 'integer' })
  idGrupo: number

  @Column({ name: 'es_habilitado', type: 'boolean' })
  esHabilitado: boolean

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date

  @Column({ name: 'usuario_creacion', type: 'varchar', length: 50 })
  usuarioCreacion: string

  @Column({ name: 'fecha_ultimo_login', type: 'timestamp' })
  fechaUltimoLogin: Date

  // Relaciones
  @ManyToOne(() => Grado)
  @JoinColumn({ name: 'id_grado' })
  grado: Grado

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'id_grupo' })
  grupo: Grupo

  constructor(data?: Partial<Usuario>) {
    if (data) Object.assign(this, data)
  }
}
