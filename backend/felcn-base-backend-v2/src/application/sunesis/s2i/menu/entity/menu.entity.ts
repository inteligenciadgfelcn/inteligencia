import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MenuHijo } from './menu-hijo.entity'

/**
 * Entidad Menu
 * Base de datos: felcn_s3i
 * Tabla: menu
 */
@Entity({ name: 'menu' })
export class Menu {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_menu' })
  id: number

  @Column({ name: 'menu_padre', type: 'varchar', length: 50 })
  menuPadre: string

  @Column({ name: 'url_padre', type: 'varchar', length: 50 })
  urlPadre: string

  @Column({ name: 'icono', type: 'varchar', length: 35 })
  icono: string

  @Column({ name: 'usuario_creacion', type: 'varchar', length: 50 })
  usuarioCreacion: string

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date

  @OneToMany(() => MenuHijo, (menuHijo) => menuHijo.menu)
  hijos: MenuHijo[]
}
