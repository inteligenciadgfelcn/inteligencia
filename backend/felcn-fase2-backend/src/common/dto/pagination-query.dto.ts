import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from 'class-validator'

export class PaginationQueryDto {

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number = 10

  @IsOptional()
  search?: string

  @IsOptional()
  sort?: string 
}