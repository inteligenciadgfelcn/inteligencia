import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'tipo_ojos', schema: 'parametricas' })
export class TipoOjo {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id_tipo_ojos',
        comment: 'Clave primaria del registro',
      })
      idTipoOjos: number
    
      @Column({
        type: 'varchar',
        length: 250,
        nullable: false,
        comment: 'Descripción de tipo ojos',
      })
      descripcion: string
}
