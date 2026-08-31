import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DetenidoSospechoso } from './detenido-sospechoso.entity'
import { DepartamentoSospechoso } from './departamento-sospechoso.entity'

@Entity({
  name: 'pais',
  schema: 'public',
})
export class PaisSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_pais',
    comment: 'Clave primaria del registro',
  })
  idPais!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre oficial del país',
  })
  descripcion!: string

  @Column({ name: 'id_continente' })
  continente!: number

  @OneToMany(() => DepartamentoSospechoso, (departamento) => departamento.pais)
  departamentos!: DepartamentoSospechoso[]

  @OneToMany(() => DetenidoSospechoso, (detenido) => detenido.pais)
  detenidos!: DetenidoSospechoso[]
}
