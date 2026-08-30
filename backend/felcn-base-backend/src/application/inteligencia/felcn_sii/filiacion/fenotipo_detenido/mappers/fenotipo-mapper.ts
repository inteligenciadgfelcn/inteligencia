import { Detenido } from '../../detenido/entities/detenido.entity'
import { ColorCabello } from '@/application/inteligencia/felcn_sii/parametricas/color_cabello/entities/color_cabello.entity'
import { ColorOjo } from '@/application/inteligencia/felcn_sii/parametricas/color_ojos/entities/color_ojo.entity'
import { ColorPiel } from '@/application/inteligencia/felcn_sii/parametricas/color_piel/entities/color_piel.entity'
import { ConstitucionCorporal } from '@/application/inteligencia/felcn_sii/parametricas/constitucion_corporal/entities/constitucion_corporal.entity'
import { TipoCabello } from '@/application/inteligencia/felcn_sii/parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { TipoNariz } from '@/application/inteligencia/felcn_sii/parametricas/tipo_nariz/entities/tipo_nariz.entity'
import { TipoOjo } from '@/application/inteligencia/felcn_sii/parametricas/tipo_ojos/entities/tipo_ojo.entity'
import { CreateFenotipoDetenidoDto } from '../dto/create-fenotipo_detenido.dto'
import { FenotipoDetenido } from '../entities/fenotipo_detenido.entity'
import { ArrestadoAuxiliar } from '@/application/inteligencia/felcn_siii/operaciones/filiacion/arrestado_auxiliar/entities/arrestado_auxiliar.entity'

export function mapFenotipoDtoToEntity(
  dto: CreateFenotipoDetenidoDto,
  persona: Detenido | ArrestadoAuxiliar
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

  fenotipo.fecha = new Date()

  // asignar detenido solo si es Detenido
  if (persona instanceof Detenido) {
    fenotipo.detenido = persona
  }

  // Mapear relaciones
  if (tipoNariz)
    fenotipo.tipoNariz = { idTipoNariz: tipoNariz } as TipoNariz

  if (constitucionCorporal)
    fenotipo.constitucionCorporal =
      { idConstitucionCorporal: constitucionCorporal } as ConstitucionCorporal

  if (idColorPiel)
    fenotipo.colorPiel = { idColorPiel } as ColorPiel

  if (idColorCabello)
    fenotipo.colorCabello = { idColorCabello } as ColorCabello

  if (idTipoCabello)
    fenotipo.tipoCabello = { idTipoCabello } as TipoCabello

  if (idColorOjos)
    fenotipo.colorOjos = { idColorOjo: idColorOjos } as ColorOjo

  if (idTipoOjos)
    fenotipo.tipoOjos = { idTipoOjos } as TipoOjo

  return fenotipo
}