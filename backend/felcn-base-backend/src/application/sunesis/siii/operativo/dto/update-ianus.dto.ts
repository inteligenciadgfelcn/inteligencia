import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

// Actualiza asignacion.ianus (columna "IANUS", visible en el frontend como "CUD"):
// el código que Fiscalía asigna al caso cuando el usuario lo registra manualmente
// tras enviarlo ("Enviar a Fiscalía").
export class UpdateIanusDto {
  @ApiProperty({ description: 'CUD asignado por Fiscalía', example: '123456789012345' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  ianus: string
}
