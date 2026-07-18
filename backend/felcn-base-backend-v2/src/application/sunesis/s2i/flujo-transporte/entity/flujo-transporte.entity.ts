import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Tabla: public.flujo_transporte (base de datos felcn_s2i)
 * Registro del viaje que vincula conductor + transporte + lugar + color.
 * FKs: codigo_transporte -> transporte, numero_documento -> conductor,
 *      id_lugar -> lugar, id_color -> parametricas.color.
 * Auditoría (_estado, _transaccion, _usuario_creacion, etc.) gestionada
 * por los defaults/triggers de BD, no se mapea aquí.
 */
@Entity({ name: 'flujo_transporte', schema: SCHEMA_PUBLIC })
export class S2iFlujoTransporte {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_flujo_transporte' })
  idFlujoTransporte: string

  @Column({ name: 'codigo_transporte', type: 'varchar', length: 10 })
  codigoTransporte: string

  @Column({ name: 'numero_documento', type: 'varchar', length: 10 })
  numeroDocumento: string

  @Column({ name: 'id_lugar', type: 'smallint' })
  idLugar: number

  @Column({ name: 'origen', type: 'varchar', length: 50 })
  origen: string

  @Column({ name: 'destino', type: 'varchar', length: 50 })
  destino: string

  @Column({ name: 'carga', type: 'varchar', length: 30 })
  carga: string

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date

  @Column({ name: 'id_color', type: 'smallint' })
  idColor: number

  @Column({ name: 'latitud', type: 'double precision' })
  latitud: number

  @Column({ name: 'longitud', type: 'double precision' })
  longitud: number

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'char', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  constructor(data?: Partial<S2iFlujoTransporte>) {
    if (data) Object.assign(this, data)
  }
}
