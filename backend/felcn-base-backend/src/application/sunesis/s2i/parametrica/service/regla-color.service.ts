import { Injectable } from '@nestjs/common'
import { ReglaColorRepository } from '../repository/regla-color.repository'

export interface ColorSugeridoItem {
  idColor: number
  origen: 'PERSONA' | 'VEHICULO'
}

export interface ColorSugerido {
  colores: ColorSugeridoItem[]
}

@Injectable()
export class ReglaColorService {
  constructor(private readonly repo: ReglaColorRepository) {}

  /**
   * Resuelve los id_color sugeridos para precargar el formulario de Flujo de Transporte,
   * evaluando parametricas.regla_color. Se evalúan TODAS las reglas activas de persona
   * (documento) y de vehículo (placa) — no se corta en la primera que matchee — y se
   * acumulan sus id_color, deduplicados, en el orden en que las reglas fueron evaluadas
   * (persona por id_regla_color ASC, luego vehículo). `colores` queda vacío si ninguna
   * regla activa aplica.
   */
  async resolverColorSugerido(
    documento?: string,
    placa?: string
  ): Promise<ColorSugerido> {
    const reglas = await this.repo.listarActivasConPersonaFuncion()
    const colores: ColorSugeridoItem[] = []
    const idsAgregados = new Set<number>()

    const agregar = (idColor: number, origen: ColorSugeridoItem['origen']) => {
      if (idsAgregados.has(idColor)) return
      idsAgregados.add(idColor)
      colores.push({ idColor, origen })
    }

    if (documento?.trim()) {
      for (const regla of reglas) {
        if (!regla.personaFuncion) continue
        const aplica = await this.repo.evaluarFuncion(
          regla.personaDatabase,
          regla.personaFuncion,
          documento.trim()
        )
        if (aplica) agregar(regla.idColor, 'PERSONA')
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
        if (aplica) agregar(regla.idColor, 'VEHICULO')
      }
    }

    return { colores }
  }
}
