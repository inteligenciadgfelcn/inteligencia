import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../shared/constants'

/**
 * Tabla: parametricas.regla_color (base de datos felcn_s2i)
 * Reglas parametrizables que sugieren un id_color al resolver un conductor
 * (por documento) o un transporte (por placa). persona_database/vehiculo_database
 * guardan el nombre de la variable de entorno que identifica la conexión donde
 * vive la función a invocar (ej. 'DB_S2I_DATABASE'), y persona_funcion/vehiculo_funcion
 * el nombre de esa función, que debe existir en el esquema parametricas de esa
 * conexión con la firma (character varying) RETURNS boolean.
 */
@Entity({ name: 'regla_color', schema: SCHEMA_PARAMETRICAS })
export class S2iReglaColor {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'id_regla_color' })
  id: number

  @Column({ name: 'id_color', type: 'smallint' })
  idColor: number

  @Column({ name: 'persona_database', type: 'varchar', length: 30, nullable: true })
  personaDatabase: string | null

  @Column({ name: 'persona_funcion', type: 'varchar', length: 30, nullable: true })
  personaFuncion: string | null

  @Column({ name: 'vehiculo_database', type: 'varchar', length: 30, nullable: true })
  vehiculoDatabase: string | null

  @Column({ name: 'vehiculo_funcion', type: 'varchar', length: 30, nullable: true })
  vehiculoFuncion: string | null

  @Column({ name: '_estado', type: 'varchar', length: 30 })
  estado: string
}
