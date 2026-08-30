import { PrimaryGeneratedColumn, Column, Entity } from "typeorm"

@Entity({ schema: 'parametricas', name: 'estado_civil' })
export class EstadoCivil {
     @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id_estado_civil',
        comment: 'Clave primaria del registro',
      })
      idEstadoCivil: number
    
      @Column({
        type: 'varchar',
        length: 250,
        nullable: false,
        comment: 'Descripción de estado civil',
      })
      descripcion: string
}
