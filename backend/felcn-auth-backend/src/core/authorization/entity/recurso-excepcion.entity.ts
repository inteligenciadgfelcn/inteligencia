import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { Status } from '@/common/constants'
import { UsuarioRol } from './usuario-rol.entity'
import { CasbinRule } from './casbin.entity'

dotenv.config()

/**
 * Excepción NEGATIVA de un recurso (pantalla/menú, política Casbin frontend)
 * para un usuario+rol puntual. La presencia de una fila es la excepción en sí
 * — no hay una bandera de "activo/inactivo" con significado de negocio.
 * Reactivar el recurso es eliminar la fila (ver `RecursoExcepcionRepository`),
 * nunca actualizar `_estado`. El check aquí solo fija un único valor posible
 * por consistencia estructural con `AuditoriaEntity`, que exige la columna.
 */
@Check("_estado = 'ACTIVO'")
@Entity({ name: 'recurso_excepcion', schema: process.env.DB_SCHEMA_USUARIO })
export class RecursoExcepcion extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla de excepciones de recurso',
  })
  id: string

  @Column({
    name: 'id_usuario_rol',
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea que referencia la combinación usuario+rol excluida',
  })
  idUsuarioRol: string

  @Column({
    name: 'id_politica',
    type: 'integer',
    nullable: false,
    comment:
      'Clave foránea que referencia la política Casbin (casbin_rule.id) excluida',
  })
  idPolitica: number

  @ManyToOne(() => UsuarioRol)
  @JoinColumn({ name: 'id_usuario_rol', referencedColumnName: 'id' })
  usuarioRol: UsuarioRol

  @ManyToOne(() => CasbinRule)
  @JoinColumn({ name: 'id_politica', referencedColumnName: 'id' })
  politica: CasbinRule

  constructor(data?: Partial<RecursoExcepcion>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = Status.ACTIVE
  }
}
