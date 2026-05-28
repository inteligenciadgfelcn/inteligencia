import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

// Corresponde a Button2_Click de ABM-ING-COSTO.aspx.cs:
// UPDATE ITEMBIENSECUESTRADO SET CostoAprox, CostoCuant WHERE ItemBienSec_Id
export class UpdateCostoBienDto {
  @ApiProperty({ description: 'Costo aproximado en dólares', example: 15000 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  costoAproximado: number

  @ApiProperty({ description: 'Costo cuantificado en dólares', example: 12000 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  costoCuantificado: number
}
