import { Entity, PrimaryColumn, Column } from 'typeorm'

/**
 * Entidad UsuarioIcia
 * Base de datos: felcn_asignacion_casos
 * Tabla: usuario_icia
 */
@Entity({ name: 'usuario_icia' })
export class UsuarioIcia {
  @PrimaryColumn({ name: 'usuario_login', type: 'char', length: 15 })
  usuarioLogin: string

  @Column({ name: 'datos_generales', type: 'varchar', length: 100 })
  datosGenerales: string
}
