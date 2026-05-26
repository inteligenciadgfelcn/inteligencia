import { Injectable } from '@nestjs/common'
import { CasoService } from '../../caso/service/caso.service'
import { BlancoService } from '../../blanco/service/blanco.service'
import { OrganizacionService } from '../../organizacion/service/organizacion.service'
import { BienService } from '../../bien/service/bien.service'

export interface FiltroCasosDto {
  nombre?: string
  estado?: string
  antecedente?: string
}

/**
 * Servicio de agregación de datos para los reportes del módulo S2I.
 * Orquesta las llamadas a los servicios existentes (Caso, Blanco, Organizacion, Bien)
 * para construir los datos necesarios para cada tipo de reporte.
 * Replica la lógica de consulta de FRM-RP-01, FRM-RP-02, RPT-MN-01 y RPT-MN-02.
 */
@Injectable()
export class ReporteCasosService {
  constructor(
    private readonly casoService: CasoService,
    private readonly blancoService: BlancoService,
    private readonly organizacionService: OrganizacionService,
    private readonly bienService: BienService,
  ) { }

  /**
   * Lista los casos del usuario autenticado aplicando filtros opcionales.
   * Equivale a la consulta de FRM-RP-01 y FRM-RP-02 (misma lógica de datos).
   */
  async listarCasos(numeroPase: string, filtro: FiltroCasosDto) {
    const casos = await this.casoService.listarPorUsuario(numeroPase)

    return casos
      .filter((c) => {
        if (
          filtro.nombre &&
          !c.nombreCaso?.toLowerCase().includes(filtro.nombre.toLowerCase())
        )
          return false
        if (
          filtro.estado &&
          !c.estadoCaso?.descripcion
            ?.toLowerCase()
            .includes(filtro.estado.toLowerCase())
        )
          return false
        if (
          filtro.antecedente &&
          !c.antecedentes
            ?.toLowerCase()
            .includes(filtro.antecedente.toLowerCase())
        )
          return false
        return true
      })
      .map((c) => ({
        idCaso: c.idCaso,
        nroCasoCer: c.nroCasoCer,
        pais: c.pais?.descripcion ?? null,
        lugar: c.lugar,
        nombreCaso: c.nombreCaso,
        estadoCaso: c.estadoCaso?.descripcion ?? null,
        etapaInvestigacion: c.etapaInvestigacion?.descripcion ?? null,
        fechaInicio: c.fechaInicio,
        antecedentes: c.antecedentes,
      }))
  }

  /**
   * Obtiene todos los datos de un caso para el reporte detallado (RPT-MN-01):
   * encabezado del caso, investigados con antecedentes/redes/GIS,
   * organizaciones con ubicación GIS, y bienes con características.
   */
  async obtenerDetalleCaso(idCaso: string) {
    const caso = await this.casoService.buscarPorId(idCaso)

    const [blancos, organizaciones, bienes] = await Promise.all([
      this.blancoService.listarPorCaso(idCaso),
      this.organizacionService.listarPorCaso(idCaso),
      this.bienService.listarPorCaso(idCaso),
    ])

    // Para cada blanco obtenemos sus antecedentes, redes sociales y lugares GIS
    const blancosCompletos = await Promise.all(
      blancos.map(async (b) => {
        const [antecedentes, redesSociales, lugares] = await Promise.all([
          this.blancoService.listarAntecedentes(b.idBlanco),
          this.blancoService.listarRedesSociales(b.idBlanco),
          this.blancoService.listarLugares(b.idBlanco),
        ])
        return { ...b, antecedentes, redesSociales, lugares }
      }),
    )

    // Para cada organización obtenemos su ubicación GIS
    const organizacionesCompletas = await Promise.all(
      organizaciones.map(async (o) => {
        const lugares = await this.organizacionService.listarLugares(o.idEmpresa)
        return { ...o, lugares }
      }),
    )

    // Para cada bien obtenemos sus características
    const bienesCompletos = await Promise.all(
      bienes.map(async (b) => {
        const caracteristicas = await this.bienService.listarCaracteristicas(
          b.idItemBienSecundario,
        )
        return { ...b, caracteristicas }
      }),
    )

    return {
      caso: {
        idCaso: caso.idCaso,
        nroCasoCer: caso.nroCasoCer,
        nombreCaso: caso.nombreCaso,
        lugar: caso.lugar,
        antecedentes: caso.antecedentes,
        fechaInicio: caso.fechaInicio,
        pais: caso.pais?.descripcion ?? null,
        estadoCaso: caso.estadoCaso?.descripcion ?? null,
        etapaInvestigacion: caso.etapaInvestigacion?.descripcion ?? null,
      },
      blancos: blancosCompletos,
      organizaciones: organizacionesCompletas,
      bienes: bienesCompletos,
    }
  }

  /**
   * Obtiene los datos de encabezado del caso y todos los marcadores GIS
   * (blancos, organizaciones, bienes) para el reporte de mapa (RPT-MN-02).
   */
  async obtenerGisCaso(idCaso: string) {
    const caso = await this.casoService.buscarPorId(idCaso)

    const [blancos, organizaciones, bienes] = await Promise.all([
      this.blancoService.listarPorCaso(idCaso),
      this.organizacionService.listarPorCaso(idCaso),
      this.bienService.listarPorCaso(idCaso),
    ])

    // Marcadores de blancos (personas investigadas)
    const marcadoresBlancos = (
      await Promise.all(
        blancos.map(async (b) => {
          const lugares = await this.blancoService.listarLugares(b.idBlanco)
          return lugares.map((l) => ({
            lat: Number(l.coordenadasX),
            lon: Number(l.coordenadasY),
            descripcion: `${b.deNombres} ${b.dePaterno} ${b.deMaterno} — ${l.descripcion}`,
            tipo: 'blanco' as const,
          }))
        }),
      )
    ).flat()

    // Marcadores de organizaciones
    const marcadoresOrganizaciones = (
      await Promise.all(
        organizaciones.map(async (o) => {
          const lugares = await this.organizacionService.listarLugares(o.idEmpresa)
          return lugares.map((l) => ({
            lat: Number(l.coordenadasX),
            lon: Number(l.coordenadasY),
            descripcion: `${o.descripcionTipoOrganizacion ?? 'Organización'}: ${o.nombre} — ${l.descripcion}`,
            tipo: 'organizacion' as const,
          }))
        }),
      )
    ).flat()

    // Marcadores de bienes
    const marcadoresBienes = (
      await Promise.all(
        bienes.map(async (b) => {
          const lugares = await this.bienService.listarLugares(
            b.idItemBienSecundario,
          )
          return lugares.map((l) => ({
            lat: Number(l.coordenadasX),
            lon: Number(l.coordenadasY),
            descripcion: `${b.descripcionBien ?? 'Bien'} — ${b.descripcionTipo ?? ''}`,
            tipo: 'bien' as const,
          }))
        }),
      )
    ).flat()

    return {
      caso: {
        idCaso: caso.idCaso,
        nombreCaso: caso.nombreCaso,
        nroCasoCer: caso.nroCasoCer,
        pais: caso.pais?.descripcion ?? null,
        lugar: caso.lugar,
        estadoCaso: caso.estadoCaso?.descripcion ?? null,
        etapaInvestigacion: caso.etapaInvestigacion?.descripcion ?? null,
        fechaInicio: caso.fechaInicio,
      },
      marcadores: [
        ...marcadoresBlancos,
        ...marcadoresOrganizaciones,
        ...marcadoresBienes,
      ],
    }
  }
}
