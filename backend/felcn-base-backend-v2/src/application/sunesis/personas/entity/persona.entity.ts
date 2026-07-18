import { Entity, PrimaryColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../shared/constants'

/**
 * Tabla: public.personas (base de datos felcn_personas)
 * Fuente de datos civiles consultada por documento de identidad.
 * No tiene llave primaria declarada en la BD; se usa `documento` como
 * clave funcional (solo lectura + inserción, sin actualización).
 */
@Entity({ name: 'personas', schema: SCHEMA_PUBLIC })
export class PersonasPersona {
  @PrimaryColumn({ name: 'documento', type: 'text' })
  documento: string

  @Column({ name: 'nombres', type: 'text' })
  nombres: string

  @Column({ name: 'paterno', type: 'text' })
  paterno: string

  @Column({ name: 'materno', type: 'text' })
  materno: string

  @Column({ name: 'esposo', type: 'text' })
  esposo: string

  @Column({ name: 'nomdep', type: 'text' })
  nomdep: string

  @Column({ name: 'nomprov', type: 'text' })
  nomprov: string

  @Column({ name: 'nommun', type: 'text' })
  nommun: string

  @Column({ name: 'fechanac', type: 'timestamptz' })
  fechanac: Date

  @Column({ name: 'sexo', type: 'text' })
  sexo: string

  @Column({ name: 'ocupacion', type: 'text' })
  ocupacion: string

  @Column({ name: 'dir1', type: 'text' })
  dir1: string

  @Column({ name: 'dir2', type: 'text' })
  dir2: string

  constructor(data?: Partial<PersonasPersona>) {
    if (data) Object.assign(this, data)
  }
}
