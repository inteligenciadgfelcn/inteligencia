import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Tabla: public.conductor (base de datos felcn_s2i)
 * Conductor resuelto a partir de public.personas (felcn_personas).
 * Auditoría (_estado, _transaccion, _usuario_creacion, etc.) gestionada
 * por los defaults/triggers de BD, no se mapea aquí.
 */
@Entity({ name: 'conductor', schema: SCHEMA_PUBLIC })
export class S2iConductor {
  @PrimaryColumn({ name: 'numero_documento', type: 'varchar', length: 10 })
  numeroDocumento: string

  @Column({ name: 'nombres', type: 'varchar', length: 75 })
  nombres: string

  @Column({ name: 'paterno', type: 'varchar', length: 50 })
  paterno: string

  @Column({ name: 'materno', type: 'varchar', length: 50 })
  materno: string

  @Column({ name: 'esposo', type: 'varchar', length: 50 })
  esposo: string

  @Column({ name: 'id_pais', type: 'integer' })
  idPais: number

  @Column({ name: 'sexo', type: 'varchar', length: 1 })
  sexo: string

  @Column({ name: 'ocupacion', type: 'varchar', length: 50 })
  ocupacion: string

  @Column({ name: 'direccion', type: 'varchar', length: 150 })
  direccion: string

  constructor(data?: Partial<S2iConductor>) {
    if (data) Object.assign(this, data)
  }
}
