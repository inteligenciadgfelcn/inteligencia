import { IsNotEmpty, IsString } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ConsultarItvDto {
  @ApiProperty({
    description: 'Token de acceso requerido por el servicio ITV',
    example: 'RkVMQ05OQVJDT1MgREUgTUlFUkRBKrb2RvoT4hHz1Hw6Pm8pRMbshjw==',
  })
  @IsString()
  @IsNotEmpty()
  token_key_narc: string

  @ApiProperty({
    description: 'Tipo de consulta para inspeccion',
    example: 'CI',
  })
  @IsString()
  @IsNotEmpty()
  tipo_consulta: string

  @ApiProperty({
    description: 'Dato a consultar (por ejemplo CI)',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  dato: string
}
