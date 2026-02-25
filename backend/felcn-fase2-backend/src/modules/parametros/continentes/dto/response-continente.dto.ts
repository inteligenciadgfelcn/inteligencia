import { PaisResponseDto } from "../../paises/dto/response-pais.dto"

export class ContinenteResponseDto {
  id: number
  nombre: string
  codigo: string
  paises?: PaisResponseDto[]
}