import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumberString, IsNotEmpty, IsString, MaxLength, IsOptional, IsInt } from "class-validator"

export class CreateImplicadosBienDto {
     @ApiProperty({
        description: 'ID del operativo',
        example: '10',
        type: String,
      })
      @IsNumberString({ no_symbols: true })
      @IsNotEmpty()
      operativoId: string
    
      @ApiProperty({
        description: 'ID del tipo de implicado',
        example: '1',
        type: String,
      })
      @IsNumberString({ no_symbols: true })
      @IsNotEmpty()
      tipoImplicadoId: string
    
      @ApiProperty({
        description: 'Nombres del implicado',
        example: 'JUAN CARLOS',
        maxLength: 50,
      })
      @IsString()
      @IsNotEmpty()
      @MaxLength(50)
      nombres: string
    
      @ApiProperty({
        description: 'Apellido paterno; enviar vacío si no corresponde',
        example: 'PEREZ',
        maxLength: 50,
      })
      @IsString()
      @MaxLength(50)
      apellidoPaterno: string
    
      @ApiProperty({
        description: 'Apellido materno; enviar vacío si no corresponde',
        example: 'MAMANI',
        maxLength: 50,
      })
      @IsString()
      @MaxLength(50)
      apellidoMaterno: string
    
      @ApiProperty({
        description: 'Apellido de casado/a; enviar vacío si no corresponde',
        example: '',
        maxLength: 50,
      })
      @IsString()
      @MaxLength(50)
      apellidoEsposo: string
    
      @ApiProperty({
        description: 'ID del tipo de documento',
        example: '1',
        type: String,
      })
      @IsNumberString({ no_symbols: true })
      @IsNotEmpty()
      tipoDocumentoId: string
    
      @ApiProperty({
        description: 'Número de documento de identidad',
        example: '1234567',
        maxLength: 15,
      })
      @IsString()
      @IsNotEmpty()
      @MaxLength(15)
      numeroDocumento: string
    
      @ApiPropertyOptional({
        description: 'ID del ítem de bien asociado',
        example: 5,
        type: Number,
        nullable: true,
      })
      @IsOptional()
      @IsInt()
      idItemBien?: number | null
}
