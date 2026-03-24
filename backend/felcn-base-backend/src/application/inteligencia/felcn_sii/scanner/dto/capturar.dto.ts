import { ApiProperty } from '@nestjs/swagger';

export class CapturarHuellaDto {
  @ApiProperty({ example: 123, description: 'ID de la persona' })
  personaId: number;

  @ApiProperty({
    example: 'INDICE_DERECHO',
    description: 'Dedo a capturar',
  })
  dedo: string;
}