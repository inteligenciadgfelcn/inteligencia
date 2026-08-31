import { Entity, PrimaryGeneratedColumn, Index, Column, ManyToOne, JoinColumn } from "typeorm"
import { UnidadSospechoso } from "../../unidad-sospechoso/entities/unidad.entity"
import { JwtAuthGuard } from "@/core/config/authorization/guards/jwt-auth.guard"
import { UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos X - Distritos')
@Entity({ name: 'distrital' })
export class DistritoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_distrital',
  })
  idDistrital!: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
  })
  abreviatura!: string

  @Column({
    type: 'varchar',
    length: 100,
  })
  descripcion!: string

  @ManyToOne(() => UnidadSospechoso, (u) => u.distritos)
  @JoinColumn({ name: 'id_unidad' }) 
  unidad!: UnidadSospechoso
}