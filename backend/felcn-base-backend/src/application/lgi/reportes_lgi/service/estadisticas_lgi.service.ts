import { Injectable, BadRequestException } from '@nestjs/common'
import { EstadisticasLgiRepository } from '../repository/estadisticas_lgi.repository'
import type {
  ResumenEstadoCaso,
  ResumenOperativos,
  ResumenBienes,
  ResumenSituacionLegal,
  ResumenPersonasInvestigadas,
  ResumenPersonasJuridicas,
  ResumenOtrosDatos,
  ItemCategoriaBien,
} from '../estadisticas-lgi.interfaces'

const ETIQUETA_CATEGORIA: Record<string, string> = {
  muebles: 'Muebles',
  inmuebles: 'Inmuebles',
  dineros: 'Dineros',
  otros: 'Otros',
}

const ORDEN_TIPO_SITUACION: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
}

/**
 * Servicio de estadísticas LGI.
 * Ensambla KPIs, desgloses y series mensuales a partir del repositorio.
 */
@Injectable()
export class EstadisticasLgiService {
  constructor(
    private readonly repository: EstadisticasLgiRepository,
  ) {}

  async resumenEstadoCaso(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenEstadoCaso> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const [kpi, porEtapaActual, porEstadoCiclo, porUnidad, porDistrito] =
      await Promise.all([
        this.repository.kpiEstadoCaso(desde, hasta),
        this.repository.estadoCasoPorEtapaActual(desde, hasta),
        this.repository.estadoCasoPorEstadoCiclo(desde, hasta),
        this.repository.estadoCasoPorUnidad(desde, hasta),
        this.repository.estadoCasoPorDistrito(desde, hasta),
      ])

    const meses = this.listarMeses(desde, hasta)
    const [iniciados, serieOperativos, filasPorEtapa] = await Promise.all([
      this.repository.estadoCasoSerieIniciados(desde, hasta),
      this.repository.estadoCasoSerieOperativos(desde, hasta),
      this.repository.estadoCasoSeriePorEtapa(desde, hasta, meses),
    ])

    const porMes = new Map(serieOperativos.map((f) => [f.yy, f]))

    const filas = meses.map((mes) => {
      const m = porMes.get(mes)
      return {
        yy: mes,
        casosIniciados: iniciados[mes] ?? 0,
        operativos: m?.operativos ?? 0,
        conclusivo: m?.conclusivo ?? 0,
        sentencia: m?.sentencia ?? 0,
        rechazados: m?.rechazados ?? 0,
      }
    })

    const seriePorEtapa = filasPorEtapa

    return {
      kpi,
      porEtapaActual,
      porEstadoCiclo,
      porUnidad,
      porDistrito,
      serie: { meses, filas, porEtapa: seriePorEtapa },
    }
  }

  async resumenOperativos(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenOperativos> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const meses = this.listarMeses(desde, hasta)

    const [kpi, porTipoInforme, porEtapa, porEstadoCiclo, porUnidad, serie, serieEtapa] =
      await Promise.all([
        this.repository.kpiOperativos(desde, hasta),
        this.repository.operativosPorTipoInforme(desde, hasta),
        this.repository.operativosPorEtapa(desde, hasta),
        this.repository.operativosPorEstadoCiclo(desde, hasta),
        this.repository.operativosPorUnidad(desde, hasta),
        this.repository.operativosSerie(desde, hasta),
        this.repository.operativosSeriePorEtapa(desde, hasta, meses),
      ])

    const porMes = new Map(serie.map((f) => [f.yy, f]))

    return {
      kpi,
      porTipoInforme,
      porEtapa,
      porEstadoCiclo,
      porUnidad,
      serie: {
        meses,
        total: meses.map((m) => porMes.get(m)?.n ?? 0),
        allanamientos: meses.map((m) => porMes.get(m)?.allanamientos ?? 0),
        trabajosDeCampo: meses.map((m) => porMes.get(m)?.trabajosDeCampo ?? 0),
        porEtapa: serieEtapa,
      },
    }
  }

  async resumenBienes(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenBienes> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const [kpi, porBienCatalogo, serie] = await Promise.all([
      this.repository.kpiBienes(desde, hasta),
      this.repository.bienesPorCatalogo(desde, hasta),
      this.repository.bienesSerieMensual(desde, hasta),
    ])

    const meses = this.listarMeses(desde, hasta)

    const buckets = new Map<string, { items: number; cantidad: number; costo: number }>()
    porBienCatalogo.forEach((b) => {
      const cat = this.categoriaDeBien(b.bienId)
      const actual = buckets.get(cat) ?? { items: 0, cantidad: 0, costo: 0 }
      actual.items += b.items
      actual.cantidad += b.cantidad
      actual.costo += b.costo
      buckets.set(cat, actual)
    })

    const orden = ['muebles', 'inmuebles', 'dineros', 'otros']
    const porCategoria: ItemCategoriaBien[] = orden
      .map((c) => {
        const v = buckets.get(c) ?? { items: 0, cantidad: 0, costo: 0 }
        return {
          categoria: c,
          etiqueta: ETIQUETA_CATEGORIA[c],
          items: v.items,
          cantidad: v.cantidad,
          costo: v.costo,
        }
      })
      .filter((x) => x.items > 0 || x.cantidad > 0 || x.costo > 0)

    const seriePorCategoria = orden
      .filter((c) => buckets.get(c)?.cantidad)
      .map((c) => ({
        categoria: c,
        etiqueta: ETIQUETA_CATEGORIA[c],
        data: meses.map((m) => {
          const match = serie.find((f) => f.yy === m && f.categoria === c)
          return match?.cantidad ?? 0
        }),
      }))

    return {
      kpi,
      porCategoria,
      porBienCatalogo,
      serie: { meses, porCategoria: seriePorCategoria },
    }
  }

  async resumenOtrosDatos(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenOtrosDatos> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const [kpi, porTipologia, porVerboRector, porEtapaCiclo] =
      await Promise.all([
        this.repository.kpiOtrosDatos(desde, hasta),
        this.repository.otrosDatosTokens('tipologias_identificadas', desde, hasta),
        this.repository.otrosDatosTokens('verbos_rectores', desde, hasta),
        this.repository.otrosDatosTokens('etapas_ciclo_lgi', desde, hasta),
      ])

    return { kpi, porTipologia, porVerboRector, porEtapaCiclo }
  }

  async resumenPersonasJuridicas(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenPersonasJuridicas> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const meses = this.listarMeses(desde, hasta)

    const [kpi, porTipoSociedad, porSituacionJuridica, porVinculo, topBeneficiarios, serie] =
      await Promise.all([
        this.repository.kpiPersonasJuridicas(desde, hasta),
        this.repository.personasJuridicasPorTipoSociedad(desde, hasta),
        this.repository.personasJuridicasPorSituacionJuridica(desde, hasta),
        this.repository.personasJuridicasPorVinculo(desde, hasta),
        this.repository.personasJuridicasTopBeneficiarios(desde, hasta),
        this.repository.personasJuridicasSerie(desde, hasta),
      ])

    const porMes = new Map(serie.map((f) => [f.yy, Number(f.n)]))

    return {
      kpi,
      porTipoSociedad,
      porSituacionJuridica,
      porVinculo,
      topBeneficiarios,
      serie: {
        meses,
        total: meses.map((m) => porMes.get(m) ?? 0),
      },
    }
  }

  async resumenPersonasInvestigadas(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenPersonasInvestigadas> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const meses = this.listarMeses(desde, hasta)

    const [kpi, porSituacionLegal, serie] = await Promise.all([
      this.repository.kpiPersonasInvestigadas(desde, hasta),
      this.repository.personasInvestigadasPorSituacionLegal(desde, hasta),
      this.repository.personasInvestigadasSerie(desde, hasta),
    ])

    const porMes = new Map(serie.map((f) => [`${f.situacion}|${f.yy}`, Number(f.cantidad)]))
    const orden = porSituacionLegal.map((s) => s.descripcion)

    return {
      kpi,
      porSituacionLegal,
      serie: {
        meses,
        porSituacion: orden.map((situacion) => ({
          situacion,
          data: meses.map((mes) => porMes.get(`${situacion}|${mes}`) ?? 0),
        })),
      },
    }
  }

  async resumenSituacionLegal(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): Promise<ResumenSituacionLegal> {
    const [desde, hasta] = this.resolverRango(fechaInicio, fechaFin, gestion)

    const meses = this.listarMeses(desde, hasta)

    const [kpi, porTipo, serie] = await Promise.all([
      this.repository.kpiSituacionLegal(desde, hasta),
      this.repository.situacionLegalPorTipo(desde, hasta),
      this.repository.situacionLegalSerie(desde, hasta),
    ])

    const seriesPorTipo = new Map(porTipo.map((p) => [p.tipoId, p.tipo]))

    const porTipoSerializado = porTipo.map((p) => ({
      ...p,
      costo: Number(p.costo),
    }))

    const porTipoGrafico = Array.from(seriesPorTipo.entries())
      .sort((a, b) => (ORDEN_TIPO_SITUACION[a[0]] ?? 99) - (ORDEN_TIPO_SITUACION[b[0]] ?? 99))
      .map(([tipoId, tipo]) => ({
        tipoId,
        tipo,
        cantidad: meses.map((mes) => {
          const match = serie.find((f) => f.yy === mes && f.tipoId === tipoId)
          return match?.cantidad ?? 0
        }),
      }))

    return {
      kpi,
      porTipoSituacion: porTipoSerializado,
      serie: { meses, porTipo: porTipoGrafico },
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private categoriaDeBien(bienId: number): string {
    if (bienId === 2) return 'inmuebles'
    if (bienId === 5) return 'dineros'
    if (bienId === 1 || bienId === 3 || bienId === 4) return 'muebles'
    return 'otros'
  }

  private resolverRango(
    fechaInicio?: string,
    fechaFin?: string,
    gestion?: number,
  ): [string, string] {
    if (gestion) {
      const anio = Math.trunc(gestion)
      if (anio < 1980 || anio > 2200) {
        throw new BadRequestException(`Gestión inválida: ${gestion}`)
      }
      return [`${anio}-01-01`, `${anio}-12-31`]
    }

    if (!fechaInicio || !fechaFin) {
      throw new BadRequestException(
        'Debe enviar fechaInicio y fechaFin, o el parámetro gestión',
      )
    }

    if (fechaInicio > fechaFin) {
      throw new BadRequestException(
        'fechaInicio no puede ser posterior a fechaFin',
      )
    }

    return [fechaInicio, fechaFin]
  }

  private listarMeses(desde: string, hasta: string): string[] {
    const [a1, m1] = desde.split('-').map(Number)
    const [a2, m2] = hasta.split('-').map(Number)

    const inicio = new Date(Date.UTC(a1, m1 - 1, 1))
    const fin = new Date(Date.UTC(a2, m2 - 1, 1))

    const meses: string[] = []
    const cursor = new Date(inicio)
    while (cursor <= fin) {
      const mes = `${cursor.getUTCFullYear()}-${String(
        cursor.getUTCMonth() + 1,
      ).padStart(2, '0')}`
      meses.push(mes)
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }

    return meses.length ? meses : [`${a1}-${String(m1).padStart(2, '0')}`]
  }
}