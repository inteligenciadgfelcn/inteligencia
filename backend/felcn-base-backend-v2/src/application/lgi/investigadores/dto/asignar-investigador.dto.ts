import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class AsignarInvestigadoresDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(15, { each: true })
  numerosPase!: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  memo!: string;
}