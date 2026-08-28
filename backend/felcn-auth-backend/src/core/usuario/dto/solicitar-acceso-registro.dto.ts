import { ApiProperty } from '@nestjs/swagger'
import { CorreoLista, IsEmail, IsNotEmpty } from '@/common/validation'

export class SolicitarAccesoRegistroDto {
  @ApiProperty({ example: 'persona@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string
}
