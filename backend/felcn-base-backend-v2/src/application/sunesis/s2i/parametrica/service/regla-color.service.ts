import { Injectable } from '@nestjs/common'
import { ReglaColorRepository } from '../repository/regla-color.repository'

export interface ColorSugerido {
  idColor: number | null
  origen: 'PERSONA' | 'VEHICULO' | null
}

@Injectable()
export class ReglaColorService {
  constructor(private readonly repo: ReglaColorRepository) {}

  /**
   * Resuelve el id_color sugerido para precargar el formulario de Flujo de Transporte,
   * evaluando parametricas.regla_color. Precedencia: si una regla de persona (documento)
   * matchea, gana sobre cualquier regla de vehículo (placa); dentro de cada categoría
   * gana la de menor id_regla_color. No sugiere nada (null) si ninguna regla activa aplica.
   */
  async resolverColorSugerido(
    documento?: string,
    placa?: string
  ): Promise<ColorSugerido> {
    const reglas = await this.repo.listarActivasConPersonaFuncion()

    if (documento?.trim()) {
      for (const regla of reglas) {
        if (!regla.personaFuncion) continue
        const aplica = await this.repo.evaluarFuncion(
          regla.personaDatabase,
          regla.personaFuncion,
          documento.trim()
        )
        if (aplica) return { idColor: regla.idColor, origen: 'PERSONA' }
      }
    }

    if (placa?.trim()) {
      for (const regla of reglas) {
        if (!regla.vehiculoFuncion) continue
        const aplica = await this.repo.evaluarFuncion(
          regla.vehiculoDatabase,
          regla.vehiculoFuncion,
          placa.trim()
        )
        if (aplica) return { idColor: regla.idColor, origen: 'VEHICULO' }
      }
    }

    return { idColor: null, origen: null }
  }
}
