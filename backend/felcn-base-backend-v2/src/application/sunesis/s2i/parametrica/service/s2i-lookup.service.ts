import { Injectable } from '@nestjs/common'
import { S2iLookupRepository } from '../repository/s2i-lookup.repository'

/**
 * Servicio de catálogos paramétricos del módulo S2I
 * Expone todos los lookup necesarios para los formularios de registro de investigaciones
 */
@Injectable()
export class S2iLookupService {
  constructor(private readonly repo: S2iLookupRepository) {}

  listarContinentes() {
    return this.repo.listarContinentes()
  }

  listarPaises(idContinente?: number) {
    return this.repo.listarPaises(idContinente)
  }

  listarEstadosCaso() {
    return this.repo.listarEstadosCaso()
  }

  listarEtapasInvestigacion() {
    return this.repo.listarEtapasInvestigacion()
  }

  listarTiposDelito() {
    return this.repo.listarTiposDelito()
  }

  listarTiposOrganizacion() {
    return this.repo.listarTiposOrganizacion()
  }

  listarContenidoCaso() {
    return this.repo.listarContenidoCaso()
  }

  listarTiposActivo() {
    return this.repo.listarTiposActivo()
  }

  listarBienes() {
    return this.repo.listarBienes()
  }

  listarClasesPorBien(idBien: number) {
    return this.repo.listarClasesPorBien(idBien)
  }

  listarTiposPorClase(idCatalogoClase: number) {
    return this.repo.listarTiposPorClase(idCatalogoClase)
  }

  listarCaracteristicasPorTipo(idCatalogoTipo: number) {
    return this.repo.listarCaracteristicasPorTipo(idCatalogoTipo)
  }

  listarTiposInvestigacionBien() {
    return this.repo.listarTiposInvestigacionBien()
  }

  listarColores() {
    return this.repo.listarColores()
  }
}
