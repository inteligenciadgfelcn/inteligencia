import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, IsNotEmpty } from 'class-validator'

export class CreateVehiculoDto {
  @ApiProperty({ description: 'Nombre del propietario del vehículo', example: 'JUAN PEREZ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  propietario: string

  @ApiProperty({ description: 'Placa del vehículo', example: '1234ABC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placa: string

  @ApiProperty({ description: 'Color del vehículo', example: 'ROJO' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  color: string

  @ApiProperty({ description: 'Marca del vehículo', example: 'TOYOTA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  marca: string
}
