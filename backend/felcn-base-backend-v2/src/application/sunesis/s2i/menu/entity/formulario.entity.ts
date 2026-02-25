import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Rol } from '../../rol/entity/rol.entity'

/**
 * Entidad Formulario
 * Base de datos: felcn_s3i
 * Tabla: formulario
 */
@Entity({ name: 'formulario' })
export class Formulario {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_formulario' })
  id: string

  @Column({ name: 'id_rol', type: 'bigint' })
  idRol: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'url', type: 'varchar', length: 50 })
  url: string

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol
}
