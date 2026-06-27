import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from '@/common/validation'
import { IsIn, IsOptional } from 'class-validator'

export class CambioRolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  idRol: string
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '' })
  token: string
}

export class AuthDto {
  @ApiProperty({
    example: 'ADMINISTRADOR',
    description: 'Usuario',
  })
  usuario: string

  @ApiProperty({
    example: 'MTIz',
    description: 'Contraseña',
  })
  contrasena: string
}

export class VerificarOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID de sesión OTP devuelto en el paso 1 de autenticación',
  })
  otpSesionId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '482931', description: 'Código OTP de 6 dígitos recibido por el canal configurado' })
  codigo: string
}

export class ActualizarOtpDto {
  @ApiProperty({ example: true, description: 'Activa o desactiva el 2FA para el usuario' })
  otpHabilitado: boolean

  @IsOptional()
  @IsIn(['EMAIL', 'WHATSAPP'])
  @ApiProperty({
    example: 'EMAIL',
    description: 'Canal de entrega del OTP: EMAIL | WHATSAPP. Omitir para usar el canal por defecto del sistema.',
    required: false,
  })
  otpCanal?: 'EMAIL' | 'WHATSAPP' | null
}
