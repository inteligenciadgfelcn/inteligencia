
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Departamento } from '../../departamentos/entities/departamento.entity'
import { BaseStatusEntity } from '../../../../common/entity/base-status.entity'
// import { Municipio } from '../../municipio/entities/municipio.entity' // opcional si luego agregas

@Entity({
  name: 'provincia',
  schema: 'parametricas',
})
export class Provincia extends BaseStatusEntity {

  @Index()
  @Column({
    name: 'id_departamento',
    type: 'int',
    nullable: false,
    comment: 'Clave foránea que referencia al departamento',
  })
  id_departamento: number

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Código de la provincia',
  })
  codigo: string

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre de la provincia',
  })
  nombre: string

  @ManyToOne(
    () => Departamento,
    (departamento) => departamento.provincias,
    {
      nullable: false,
      onDelete: 'RESTRICT', 
    },
  )
  @JoinColumn({
    name: 'id_departamento',
    referencedColumnName: 'id',
  })
  departamento: Departamento

  // Si luego agregas municipio:
  /*
  @OneToMany(
    () => Municipio,
    (municipio) => municipio.provincia,
  )
  municipios: Municipio[]
  */

  constructor(data?: Partial<Provincia>) {
    super(data)
  }
}
