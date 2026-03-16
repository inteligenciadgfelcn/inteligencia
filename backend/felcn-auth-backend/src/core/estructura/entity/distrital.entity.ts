import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { DistritaEstado } from '../constant'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { Unidad } from './unidad.entity'
import { Grupo } from './grupo.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(DistritaEstado))
@Entity({ name: 'distrital', schema: process.env.DB_SCHEMA_PARAMETRO })
export class Distrital extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
    comment: 'Clave primaria de la tabla Distrital',
  })
  id: number

  @Column({
    name: 'id_unidad',
    type: 'integer',
    comment: 'Clave foránea que referencia la Unidad organizacional',
  })
  idUnidad: number

  @Column({
    length: 150,
    type: 'varchar',
    comment: 'Descripción de la distrital',
  })
  descripcion: string

  @ManyToOne(() => Unidad, (unidad) => unidad.distritales)
  @JoinColumn({ name: 'id_unidad', referencedColumnName: 'id' })
  unidad: Unidad

  @OneToMany(() => Grupo, (grupo) => grupo.distrital)
  grupos: Grupo[]

  constructor(data?: Partial<Distrital>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || DistritaEstado.ACTIVE
  }
}
