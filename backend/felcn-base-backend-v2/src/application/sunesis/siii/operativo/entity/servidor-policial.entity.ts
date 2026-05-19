import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { Operativo } from './operativo.entity'
import { Grado } from '../../parametrica/entity/estructura/grado.entity'

/**
 * Entidad Servidor Policial
 * Policías participantes en un operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: servidor_policial
 */
@Entity({ name: 'servidor_policial', schema: SCHEMA_PUBLIC })
export class ServidorPolicial {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_servidor_policial' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'id_grado', type: 'integer' })
  idGrado: number

  @Column({ name: 'nombre_apellidos', type: 'varchar', length: 150 })
  nombreApellidos: string

  @Column({ name: 'info_actualizada', type: 'text' })
  infoActualizada: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  @ManyToOne(() => Grado)
  @JoinColumn({ name: 'id_grado' })
  grado?: Grado

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<ServidorPolicial>) {
    if (data) Object.assign(this, data)
  }
}
