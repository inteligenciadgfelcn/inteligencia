import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

export class FiltrosSolicitudRegistroDto extends PaginacionQueryDto {
  readonly estado?: string
}
