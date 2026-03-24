import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity({ schema: 'parametricas', name: 'constitucion_corporal' })
export class ConstitucionCorporal {
     @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id_constitucion_corporal',
        comment: 'Clave primaria del registro',
      })
      idConstitucionCorporal: number
    
      @Column({
        type: 'varchar',
        length: 250,
        nullable: false,
        comment: 'Descripción de constitucion corporal',
      })
      descripcion: string
}
