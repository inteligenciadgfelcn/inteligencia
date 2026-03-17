import { UtilService } from '@/common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import dotenv from 'dotenv'
import { UnidadEstado } from '../constant'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { Distrital } from './distrital.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(UnidadEstado))
@Entity({ name: 'unidad', schema: process.env.DB_SCHEMA_PARAMETRO })
export class Unidad extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
    comment: 'Clave primaria de la tabla Unidad',
  })
  id: number

  @Column({
    length: 20,
    type: 'varchar',
    comment: 'Abreviatura de la unidad organizacional',
  })
  abreviatura: string

  @Column({
    length: 150,
    type: 'varchar',
    comment: 'Descripción completa de la unidad organizacional',
  })
  descripcion: string

  @Column({
    name: 'es_operativa_admin',
    type: 'boolean',
    default: false,
    comment: 'Indica si la unidad es operativa-administrativa',
  })
  esOperativaAdmin: boolean

  @OneToMany(() => Distrital, (distrital) => distrital.unidad)
  distritales: Distrital[]

  constructor(data?: Partial<Unidad>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UnidadEstado.ACTIVE
  }
}
