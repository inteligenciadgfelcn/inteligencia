import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

/**
 * DTO reutilizable para subir un archivo adjunto
 * Usado en archivos_blanco, archivos_organizacion y archivos_bien
 * El archivo binario se recibe vía multipart/form-data en el campo "archivo"
 */
export class CreateArchivoDto {
  @ApiProperty({
    description: 'ID del tipo de contenido del caso',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  idContenidoCaso: string

  @ApiProperty({
    description: 'Tipo de archivo (pdf, jpg, docx, etc.)',
    example: 'pdf',
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  tipo: string

  @ApiProperty({
    description: 'Nombre descriptivo del documento',
    example: 'ACTA DE DECOMISO',
    maxLength: 150,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string
}
