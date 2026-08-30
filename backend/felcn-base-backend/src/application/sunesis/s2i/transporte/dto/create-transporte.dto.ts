import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateTransporteDto {
  @ApiProperty({
    description: 'Placa o código Charly Papa',
    example: '1234ABC',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placa: string

  @ApiProperty({ description: 'Tipo de vehículo', example: 'AUTOMOVIL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  tipoVehiculo: string

  @ApiProperty({ description: 'Marca', example: 'TOYOTA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  marca: string

  @ApiProperty({ description: 'Modelo', example: '2020' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  modelo: string

  @ApiProperty({ description: 'Clase', example: 'SEDAN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  clase: string

  @ApiProperty({ description: 'Color', example: 'ROJO' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  color: string

  @ApiProperty({ description: 'Número de motor', example: 'MT123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  motor: string

  @ApiProperty({ description: 'Número de chasis', example: 'CH123456' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  chasis: string
}
