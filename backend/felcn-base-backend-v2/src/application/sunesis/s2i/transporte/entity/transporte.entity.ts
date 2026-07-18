import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Tabla: public.transporte (base de datos felcn_s2i)
 * Transporte resuelto a partir de public.vehiculo (felcn_vls) o registrado manualmente.
 * Auditoría (_estado, _transaccion, _usuario_creacion, etc.) gestionada
 * por los defaults/triggers de BD, no se mapea aquí.
 */
@Entity({ name: 'transporte', schema: SCHEMA_PUBLIC })
export class S2iTransporte {
  @PrimaryColumn({ name: 'codigo_transporte', type: 'varchar', length: 10 })
  codigoTransporte: string

  @Column({ name: 'tipo', type: 'varchar', length: 10 })
  tipo: string

  @Column({ name: 'marca', type: 'varchar', length: 50 })
  marca: string

  @Column({ name: 'modelo', type: 'varchar', length: 4 })
  modelo: string

  @Column({ name: 'clase', type: 'varchar', length: 15 })
  clase: string

  @Column({ name: 'tipo_transporte', type: 'varchar', length: 20 })
  tipoTransporte: string

  @Column({ name: 'color', type: 'varchar', length: 20 })
  color: string

  @Column({ name: 'chasis', type: 'varchar', length: 30 })
  chasis: string

  @Column({ name: 'motor', type: 'varchar', length: 30 })
  motor: string

  constructor(data?: Partial<S2iTransporte>) {
    if (data) Object.assign(this, data)
  }
}
