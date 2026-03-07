import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad GrupoCaso
 * Base de datos: felcn_asignacion_casos
 * Tabla: grupo
 */
@Entity({ name: 'grupo' })
export class GrupoCaso {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_grupo' })
  idGrupo: number

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
