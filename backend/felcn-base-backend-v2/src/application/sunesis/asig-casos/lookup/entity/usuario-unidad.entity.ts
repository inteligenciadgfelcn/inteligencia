import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { DepartamentoCaso } from './departamento-caso.entity'
import { UnidadCaso } from './unidad-caso.entity'

/**
 * Entidad UsuarioUnidad
 * Base de datos: felcn_asignacion_casos
 * Tabla: usuario_unidad
 * PK compuesta: (usuario_login, id_departamento, id_unidad)
 */
@Entity({ name: 'usuario_unidad' })
export class UsuarioUnidad {
  @PrimaryColumn({ name: 'usuario_login', type: 'char', length: 15 })
  usuarioLogin: string

  @PrimaryColumn({ name: 'id_departamento', type: 'char', length: 2 })
  idDepartamento: string

  @PrimaryColumn({ name: 'id_unidad', type: 'char', length: 2 })
  idUnidad: string

  @ManyToOne(() => DepartamentoCaso)
  @JoinColumn({ name: 'id_departamento' })
  departamento: DepartamentoCaso

  @ManyToOne(() => UnidadCaso)
  @JoinColumn({ name: 'id_unidad' })
  unidad: UnidadCaso
}
