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
import { GradoEstado } from '../constant'
import { AuditoriaEntity } from '@/common/entity/auditoria.entity'

dotenv.config()

@Check(UtilService.buildStatusCheck(GradoEstado))
@Entity({ name: 'grado', schema: process.env.DB_SCHEMA_PARAMETRO })
export class Grado extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
    comment: 'Clave primaria de la tabla Grado',
  })
  id: number

  @Column({
    length: 20,
    type: 'varchar',
    comment: 'Abreviatura del grado (ej: Tte., Cbte., My.)',
  })
  abreviatura: string

  @Column({
    length: 100,
    type: 'varchar',
    comment: 'Descripción completa del grado',
  })
  descripcion: string

  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Orden jerárquico del grado para ordenamiento',
  })
  orden?: number | null

  constructor(data?: Partial<Grado>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || GradoEstado.ACTIVE
  }
}
