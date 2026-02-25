import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Menu } from './menu.entity'

/**
 * Entidad MenuHijo
 * Base de datos: felcn_s3i
 * Tabla: menu_hijo
 */
@Entity({ name: 'menu_hijo' })
export class MenuHijo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_menu_hijo' })
  id: number

  @Column({ name: 'id_menu', type: 'integer' })
  idMenu: number

  @Column({ name: 'nombre_menu', type: 'varchar', length: 50 })
  nombreMenu: string

  @Column({ name: 'url', type: 'varchar', length: 50 })
  url: string

  @Column({ name: 'icono', type: 'varchar', length: 35, nullable: true })
  icono?: string

  @Column({ name: 'usuario_creacion', type: 'varchar', length: 50 })
  usuarioCreacion: string

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date

  @ManyToOne(() => Menu, (menu) => menu.hijos)
  @JoinColumn({ name: 'id_menu' })
  menu: Menu
}
