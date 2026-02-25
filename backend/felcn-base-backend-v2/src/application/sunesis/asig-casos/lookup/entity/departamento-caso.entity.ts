import { Entity, PrimaryColumn, Column } from 'typeorm'

/**
 * Entidad DepartamentoCaso
 * Base de datos: felcn_asignacion_casos
 * Tabla: departamento
 */
@Entity({ name: 'departamento' })
export class DepartamentoCaso {
  @PrimaryColumn({ name: 'id_departamento', type: 'char', length: 2 })
  idDepartamento: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
