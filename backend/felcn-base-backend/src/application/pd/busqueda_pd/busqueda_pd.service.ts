import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { PaginacionQueryDto } from '@/common/dto'
import { BusquedaPdRepository } from './busqueda-pd.repository'
import { FiltrosVariablesCruzadasPdDto } from './dto/filtros-variables-cruzadas.dto'

@Injectable()
export class BusquedaPdService {
  constructor(private readonly repository: BusquedaPdRepository) {}

  buscarGeneralPaginado(
    f: FiltrosVariablesCruzadasPdDto,
    pagination: PaginacionQueryDto
  ) {
    const filtros = this.prepararFiltros(f)
    if (
      !Number.isSafeInteger(pagination.limite) ||
      pagination.limite < 1 ||
      !Number.isSafeInteger(pagination.saltar) ||
      pagination.saltar < 0
    ) {
      throw new BadRequestException('Paginación inválida')
    }
    return this.repository.buscarGeneralPaginado(filtros, pagination)
  }

  async obtenerDetalle(casosId: string) {
    if (
      !/^[1-9]\d{0,18}$/.test(casosId) ||
      BigInt(casosId) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        'casosId debe ser un bigint positivo válido'
      )
    }
    const caso = await this.repository.obtenerDetalle(casosId)
    if (!caso)
      throw new NotFoundException(
        `No existe un caso PD activo con casos_id ${casosId}`
      )
    return caso
  }

  obtenerCatalogos() {
    return this.repository.obtenerCatalogos()
  }

  obtenerTodosParaExportar(f: FiltrosVariablesCruzadasPdDto) {
    return this.repository.obtenerFilasExportacion(this.prepararFiltros(f))
  }

  private prepararFiltros(
    entrada: FiltrosVariablesCruzadasPdDto | null | undefined
  ) {
    if (
      entrada != null &&
      (typeof entrada !== 'object' || Array.isArray(entrada))
    ) {
      throw new BadRequestException('Los filtros deben ser un objeto JSON')
    }
    const f = plainToInstance(FiltrosVariablesCruzadasPdDto, entrada ?? {}, {
      enableImplicitConversion: false,
    })
    const errores = validateSync(f, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })
    if (errores.length) {
      throw new BadRequestException(
        errores.flatMap((e) => Object.values(e.constraints ?? {}))
      )
    }
    const rangos = [
      ['Inicio del caso', f.inicioCasoDesde, f.inicioCasoHasta],
      ['Fecha del informe', f.informeDesde, f.informeHasta],
      ['Registro de persona', f.personaRegistroDesde, f.personaRegistroHasta],
      ['Registro de bien', f.bienRegistroDesde, f.bienRegistroHasta],
      ['Registro de empresa', f.empresaRegistroDesde, f.empresaRegistroHasta],
    ]
    for (const [nombre, desde, hasta] of rangos) {
      if (desde && hasta && desde > hasta)
        throw new BadRequestException(
          `${nombre}: desde no puede ser posterior a hasta`
        )
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
    const situaciones = [
      ['Persona', f.personaSinSituacion, f.situacionPersonaId],
      [
        'Situación legal del bien',
        f.bienSinSituacionLegal,
        f.situacionLegalBien,
      ],
      [
        'Situación jurídica del bien',
        f.bienSinSituacionJuridica,
        f.situacionJuridicaBienId,
      ],
      ['Empresa', f.empresaSinSituacion, f.situacionEmpresaId],
    ] as const
    for (const [nombre, sin, id] of situaciones) {
      if (sin === true && id !== undefined) {
        throw new BadRequestException(
          `${nombre}: no combine sin situación con una situación específica`
        )
      }
    }
    return f
  }
}
