import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { CatalogoCaracteristicasLgi } from '../../parametro/catalogo-caracteristica/entities/catalogo-caracteristica.entity'

@Entity({
  name: 'itembiencaracteristicas',
})
export class CaracteristicasBiene {
  @PrimaryGeneratedColumn({
    name: 'itembiencar_id',
    type: 'bigint',
  })
  itembiencarId: number

  @Column({
    name: 'itembiensec_id',
    type: 'int',
  })
  itembiensecId: number

  @Column({
    name: 'catcarac_id',
    type: 'int',
  })
  catcaracId: number

  @Column({
    name: 'descripcion',
    type: 'text',
  })
  descripcion: string

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 15,
    default: 'ACTIVO',
  })
  estado: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'char',
    length: 15,
  })
  usuario: string

  @ManyToOne(
    () => BieneSecuestradoLgi,
    (bienSecuestrado) => bienSecuestrado.caracteristicas,
    {
      nullable: false,
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({
    name: 'itembiensec_id',
    referencedColumnName: 'itembiensecId',
  })
  bienSecuestrado: BieneSecuestradoLgi

  @ManyToOne(() => CatalogoCaracteristicasLgi, {
    nullable: false,
  })
  @JoinColumn({
    name: 'catcarac_id',
    referencedColumnName: 'catcaracId',
  })
  catalogoCaracteristica: CatalogoCaracteristicasLgi
}
