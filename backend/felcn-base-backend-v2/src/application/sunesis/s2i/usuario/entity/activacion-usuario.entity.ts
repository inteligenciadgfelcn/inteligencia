import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { Usuario } from './usuario.entity'

/**
 * Entidad ActivacionUsuario
 * Base de datos: felcn_s3i
 * Tabla: activacion_usuario
 */
@Entity({ name: 'activacion_usuario' })
export class ActivacionUsuario {
  @PrimaryColumn({ name: 'id_usuario', type: 'bigint' })
  idUsuario: string

  @Column({ name: 'codigo_activacion', type: 'uuid' })
  codigoActivacion: string

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario
}
