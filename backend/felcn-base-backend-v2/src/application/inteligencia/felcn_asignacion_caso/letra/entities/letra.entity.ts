import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { AsignacionASIG } from '../../asignaciones/entities/asignacionAsig.entity'

@Entity({
  name: 'letra',
})
export class Letra {
  @PrimaryColumn({
    type: 'varchar',
    name: 'codigo',
    length: 10,
    nullable: false,
    comment:
      'Letra identificadora utilizada para la generación del número de caso',
  })
  descripcion!: string

  @OneToMany(() => AsignacionASIG, (asignacion) => asignacion.letra)
  asignaciones!: AsignacionASIG[]
}
