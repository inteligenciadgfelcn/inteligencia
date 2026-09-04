import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { CalidadBienLgi } from '../../parametro/calidad-bien/entities/calidad-bien.entity'

@Entity({
  name: 'itembienjuridica',
})
export class SituacionJuridicaBien {
  @PrimaryGeneratedColumn({
    name: 'itembienjur_id',
    type: 'bigint',
  })
  itembienjurId: string

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itembiensecId: string

  @Column({
    name: 'catjur_id',
    type: 'bigint',
  })
  catjurId: string

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 50,
  })
  descripcion: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamp without time zone',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'char',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 15,
    default: 'ACTIVO',
  })
  estado: string

  @ManyToOne(
    () => BieneSecuestradoLgi,
    (bienSecuestrado) => bienSecuestrado.situacionesJuridicas,
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

  @ManyToOne(() => CalidadBienLgi, {
    nullable: false,
  })
  @JoinColumn({
    name: 'catjur_id',
  })
  calidadBien: CalidadBienLgi
}
