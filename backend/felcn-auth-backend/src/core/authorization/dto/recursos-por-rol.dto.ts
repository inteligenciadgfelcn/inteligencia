import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from '@/common/validation'

export class RecursosPorRolDto {
  @ApiProperty({ example: 'INVESTIGADOR' })
  @IsNotEmpty()
  rol: string

  @IsOptional()
  @ApiProperty({
    example: '4',
    required: false,
    description:
      'id de usuario_rol. Se omite en alta de usuario (todavía no existe la fila) — sin este dato se devuelve el catálogo con todo excluido=false.',
  })
  idUsuarioRol?: string
}
