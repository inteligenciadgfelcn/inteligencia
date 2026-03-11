
import { Detenido } from '../../detenido/entities/detenido.entity'
import { TipoNariz } from '@/application/inteligencia/felcn_siii/parametricas/tipo_nariz/entities/tipo_nariz.entity'
import { ConstitucionCorporal } from '@/application/inteligencia/felcn_siii/parametricas/constitucion_corporal/entities/constitucion_corporal.entity'
import { ColorPiel } from '@/application/inteligencia/felcn_siii/parametricas/color_piel/entities/color_piel.entity'
import { ColorCabello } from '@/application/inteligencia/felcn_siii/parametricas/color_cabello/entities/color_cabello.entity'
import { TipoCabello } from '@/application/inteligencia/felcn_siii/parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { ColorOjo } from '@/application/inteligencia/felcn_siii/parametricas/color_ojos/entities/color_ojo.entity'
import { TipoOjo } from '@/application/inteligencia/felcn_siii/parametricas/tipo_ojos/entities/tipo_ojo.entity'
import { CreateFenotipoDetenidoDto } from '../dto/create-fenotipo_detenido.dto'
import { FenotipoDetenido } from '../entities/fenotipo_detenido.entity'

export function mapFenotipoDtoToEntity(
  dto: CreateFenotipoDetenidoDto,
  detenido: Detenido
): FenotipoDetenido {
  const fenotipo = new FenotipoDetenido()
  const {
    tipoNariz,
    constitucionCorporal,
    idColorPiel,
    idColorCabello,
    idTipoCabello,
    idColorOjos,
    idTipoOjos,
    ...rest
  } = dto

  Object.assign(fenotipo, rest)

  fenotipo.detenido = detenido
  fenotipo.fecha = new Date()

  // Mapear IDs a objetos de relación
  if (tipoNariz) fenotipo.tipoNariz = { idTipoNariz: tipoNariz } as TipoNariz
  if (constitucionCorporal) fenotipo.constitucionCorporal = { idConstitucionCorporal: constitucionCorporal } as ConstitucionCorporal
  if (idColorPiel) fenotipo.colorPiel = { idColorPiel } as ColorPiel
  if (idColorCabello) fenotipo.colorCabello = { idColorCabello } as ColorCabello
  if (idTipoCabello) fenotipo.tipoCabello = { idTipoCabello } as TipoCabello
  if (idColorOjos) fenotipo.colorOjos = { idColorOjo: idColorOjos } as ColorOjo
  if (idTipoOjos) fenotipo.tipoOjos = { idTipoOjos } as TipoOjo

  return fenotipo
}