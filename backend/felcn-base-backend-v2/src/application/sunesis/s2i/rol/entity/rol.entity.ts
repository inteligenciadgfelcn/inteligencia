import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { AuditoriaEntity } from '@/common/entity'

/**
 * Entidad Rol
 * Base de datos: felcn_s3i
 * Tabla: rol
 */
@Entity({ name: 'rol' })
export class Rol extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_rol' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string

  @Column({ name: 'icono', type: 'varchar', length: 35 })
  icono: string

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacionRol: Date

  @Column({ name: 'usuario_creacion', type: 'varchar', length: 50 })
  usuarioCreacionRol: string

  constructor(data?: Partial<Rol>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
