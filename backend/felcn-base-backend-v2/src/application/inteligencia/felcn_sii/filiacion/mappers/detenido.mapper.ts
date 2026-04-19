import { DeepPartial } from 'typeorm'
import { Detenido } from '../detenido/entities/detenido.entity'
import { CreateFiliacionDto } from '../dto/create-filiacion.dto'

export function mapDetenidoEntity(
  dto: CreateFiliacionDto
): DeepPartial<Detenido> {
  const {
    numeroCaso,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    apellidoEsposo,
    genero,
    fechaNacimiento,
    direccion,
    observacion,
    detenido,
    idPais,
    idEstadoCivil,
  } = dto

  return {
    numeroCaso,

    nombres,
    apellidoPaterno,
    apellidoMaterno,
    apellidoEsposo,

    genero,
    fechaNacimiento,
    direccion,
    observaciones: observacion,
    observacionesAdicionales: detenido?.observacionAdicional,

    serie: detenido?.serie,
    seccion: detenido?.seccion,

    tieneTarjeta: detenido?.tieneTarjeta,
    estaVivo: detenido?.estaVivo,

    fotoFrente: detenido?.fotoFrente,
    fotoPerfilDerecho: detenido?.fotoPerfilDerecho,
    fotoPerfilIzquierdo: detenido?.fotoPerfilIzquierdo,

    pais: idPais ? { idPais } : undefined,

    estadoCivil: idEstadoCivil ? { idEstadoCivil } : undefined,
  }
}
