import { PaginacionQueryDto } from '@/common/dto'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BusquedaPdRepository } from './busqueda-pd.repository'
import { FiltrosVariablesCruzadasPdDto } from './dto/filtros-variables-cruzadas.dto'

@Injectable()
export class BusquedaPdService {
  constructor(private readonly repository: BusquedaPdRepository) {}

  async buscarGeneralPaginado(
    f: FiltrosVariablesCruzadasPdDto,
    pagination: PaginacionQueryDto
  ){
    this.validarFiltros(f ?? {})
    return this.repository.buscarGeneralPaginado(f ?? {}, pagination)
  }

  async obtenerDetalle(casosId: string): Promise<Record<string, any>> {
    // PostgreSQL bigint se conserva como texto para no perder precisión en JSON.
    if (
      !/^[1-9]\d{0,18}$/.test(casosId) ||
      BigInt(casosId) > 9223372036854775807n
    ) {
      throw new BadRequestException(
        'casosId debe ser un entero positivo válido'
      )
    }
    const caso = await this.repository.obtenerDetalle(casosId)
    if (!caso)
      throw new NotFoundException(
        `No existe un caso Pd activo con casos_id ${casosId}`
      )
    return caso
  }

  obtenerCatalogos(): Promise<Record<string, any>> {
    return this.repository.obtenerCatalogos()
  }

  async obtenerTodosParaExportar(
    f: FiltrosVariablesCruzadasPdDto
  ): Promise<Record<string, any>[]> {
    this.validarFiltros(f ?? {})
    return this.repository.obtenerFilasExportacion(f ?? {})
  }

  private validarFiltros(f: FiltrosVariablesCruzadasPdDto): void {
    const rangos: Array<[string, string | undefined, string | undefined]> = [
      ['Inicio del caso', f.inicioCasoDesde, f.inicioCasoHasta],
      ['Fecha del informe', f.informeDesde, f.informeHasta],
      ['Registro de persona', f.personaRegistroDesde, f.personaRegistroHasta],
      ['Registro del bien', f.bienRegistroDesde, f.bienRegistroHasta],
      ['Registro de empresa', f.empresaRegistroDesde, f.empresaRegistroHasta],
    ]
    for (const [nombre, desde, hasta] of rangos) {
      if (desde && hasta && desde > hasta) {
        throw new BadRequestException(
          `${nombre}: desde no puede ser posterior a hasta`
        )
      }
    }
    if (
      f.valorBienDesde !== undefined &&
      f.valorBienHasta !== undefined &&
      f.valorBienDesde > f.valorBienHasta
    ) {
      throw new BadRequestException(
        'El valor mínimo del bien no puede superar el máximo'
      )
    }
  }
}
