import { DeepPartial } from 'typeorm'
import { CreateFiliacionDto } from '../dto/create-filiacion.dto'
import { ColorPiel } from '@/application/inteligencia/felcn_sii/parametricas/color_piel/entities/color_piel.entity'
import { TipoCabello } from '@/application/inteligencia/felcn_sii/parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { Pais } from '@/application/inteligencia/felcn_sii/parametricas/pais/entities/pais.entity'
import { EstadoCivil } from '@/application/inteligencia/felcn_sii/parametricas/estado_civil/entities/estado_civil.entity'
import { ColorOjo } from '../../parametricas/color_ojos/entities/color_ojo.entity'
import { ColorCabello } from '../../parametricas/color_cabello/entities/color_cabello.entity'
import { ArrestadoAuxiliar } from '@/application/inteligencia/felcn_siii/operaciones/filiacion/arrestado_auxiliar/entities/arrestado_auxiliar.entity'

export function mapArrestadoEntity(
  dto: CreateFiliacionDto,
  profesionDescripcion: string | null
): DeepPartial<ArrestadoAuxiliar> {
  const {
    arrestado,
    documento,
    fenotipo,
    detenido,
    numeroCaso,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    apellidoEsposo,
    genero,
    fechaNacimiento,
    idPais,
    idEstadoCivil,
    direccion,
    observacion,
  } = dto

  let pais: Pais | undefined
  if (idPais) {
    pais = new Pais()
    pais.idPais = idPais
  }

  let estadoCivil: EstadoCivil | undefined
  if (idEstadoCivil) {
    estadoCivil = new EstadoCivil()
    estadoCivil.idEstadoCivil = idEstadoCivil
  }

  let colorOjos: ColorOjo | undefined
  if (fenotipo?.idColorOjos) {
    colorOjos = new ColorOjo()
    colorOjos.idColorOjo = fenotipo.idColorOjos
  }

  let colorPiel: ColorPiel | undefined
  if (fenotipo?.idColorPiel) {
    colorPiel = new ColorPiel()
    colorPiel.idColorPiel = fenotipo.idColorPiel
  }

  let tipoCabello: TipoCabello | undefined
  if (fenotipo?.idTipoCabello) {
    tipoCabello = new TipoCabello()
    tipoCabello.idTipoCabello = fenotipo.idTipoCabello
  }
  let colorCabello: ColorCabello | undefined
  if (fenotipo?.idColorCabello) {
    colorCabello = new ColorCabello()
    colorCabello.idColorCabello = fenotipo.idColorCabello
  }

  return {
    idOperativo: arrestado?.idOperativo,

    numeroCaso,

    nombres,
    apellidoPaterno,
    apellidoMaterno,
    apellidoEsposo,

    genero,

    pais: pais?.idPais,
    estadoCivil,

    numeroDocumento: documento?.numeroDocumento,

    fechaNacimiento,

    lugarNacimiento: arrestado?.lugarNacimiento,

    ocupacion: profesionDescripcion ?? undefined,

    direccion,

    fotoFrente: detenido?.fotoFrente,

    fotoDedoDerecho: arrestado?.fotoDedoDerecho,
    fotoDedoIzquierdo: arrestado?.fotoDedoIzquierdo,

    colorPiel,
    colorOjos,
    tipoCabello,
    colorCabello,

    senasParticulares: fenotipo?.senasParticulares,
    estatura: fenotipo?.estatura,

    lugarArresto: arrestado?.lugarOperativo,

    observaciones: observacion,
  }
}
