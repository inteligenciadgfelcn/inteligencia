import { ApiProperty }
  from '@nestjs/swagger';

export class CapturarHuellaDto
{
  @ApiProperty({
    example:
      'DESKTOP-ABC_ZF1 28068351',
  })
  scannerId!: string;

  @ApiProperty({
    example: 123,
  })
  personaId!: number;

  @ApiProperty({
    example:
      'INDICE_DERECHO',
  })
  dedo!: string;
}