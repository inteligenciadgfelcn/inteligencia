import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  name: 'letra',
  schema: 'parametricas',
})
export class Letra {
  @PrimaryColumn({
    type: 'varchar',
    name: 'letras',
    length: 10,
    nullable: false,
    comment:
      'Letra identificadora utilizada para la generación del número de caso',
  })
  descripcion: string
}
