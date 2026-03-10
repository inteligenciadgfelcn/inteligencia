import { PrimaryGeneratedColumn, Column } from "typeorm"

export class ProfesionDetenido {
     @PrimaryGeneratedColumn({
        name: 'id_profesion_detenido',
        type: 'int',
        comment: 'Clave primaria del registro',
      })
      idProfesionDetenido: number
    
      @Column({
        name: 'id_detenido',
        type: 'int',
        nullable: true,
        comment: 'Identificador del detenido',
      })
      idDetenido: number
    
     
    
      @Column({
        name: 'fecha_hora_ingreso',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha y hora de ingreso del registro',
      })
      fechaHoraIngreso: Date
    
      @Column({
        name: 'usuario',
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'Usuario que registró la información',
      })
      usuario: string
    
      @Column({
        name: 'fecha_hora_actualizacion',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha y hora de última actualización',
      })
      fechaHoraActualizacion: Date
    
      @Column({
        name: 'usuario_actualizacion',
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: 'Usuario que realizó la última actualización',
      })
      usuarioActualizacion: string
}
