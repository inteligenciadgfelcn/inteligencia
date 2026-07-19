import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transaccion } from '../constants'

export abstract class AuditoriaEntity extends BaseEntity {
  @Column({
    name: '_estado',
    length: 30,
    type: 'varchar',
    nullable: false,
    comment: 'Estado del registro',
  })
  estado: string

  @Column('varchar', {
    name: '_transaccion',
    length: 30,
    nullable: false,
    comment: 'Tipo de operación ejecutada',
  })
  transaccion: string

  @Column('varchar', {
    name: '_usuario_creacion',
    length: 50,
    nullable: false,
    comment: 'Usuario (login/CI) que creó el registro',
  })
  usuarioCreacion: string

  @CreateDateColumn({
    name: '_fecha_creacion',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
    comment: 'Fecha de creación',
  })
  fechaCreacion: Date

  @Column('varchar', {
    name: '_usuario_modificacion',
    length: 50,
    nullable: true,
    comment: 'Usuario (login/CI) que realizó una modificación',
  })
  usuarioModificacion?: string | null

  @UpdateDateColumn({
    name: '_fecha_modificacion',
    type: 'timestamp without time zone',
    nullable: true,
    comment: 'Fecha en que se realizó una modificación',
  })
  fechaModificacion?: Date | null

  @BeforeInsert()
  insertarTransaccion() {
    this.transaccion = this.transaccion || Transaccion.CREAR
  }

  @BeforeUpdate()
  actualizarTransaccion() {
    this.transaccion = this.transaccion || Transaccion.ACTUALIZAR
  }

  protected constructor(data?: Partial<AuditoriaEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}
