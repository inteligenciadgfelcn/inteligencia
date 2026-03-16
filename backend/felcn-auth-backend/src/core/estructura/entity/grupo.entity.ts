import { UtilService } from '@/common/lib/util.service'
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
import { GrupoEstado } from '../constant'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'
import { Distrital } from './distrital.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(GrupoEstado))
@Entity({ name: 'grupo', schema: process.env.DB_SCHEMA_PARAMETRO })
export class Grupo extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
    comment: 'Clave primaria de la tabla Grupo',
  })
  id: number

  @Column({
    name: 'id_distrital',
    type: 'integer',
    comment: 'Clave foránea que referencia la Distrital',
  })
  idDistrital: number

  @Column({
    length: 150,
    type: 'varchar',
    comment: 'Descripción del grupo operacional',
  })
  descripcion: string

  @ManyToOne(() => Distrital, (distrital) => distrital.grupos)
  @JoinColumn({ name: 'id_distrital', referencedColumnName: 'id' })
  distrital: Distrital

  constructor(data?: Partial<Grupo>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || GrupoEstado.ACTIVE
  }
}
