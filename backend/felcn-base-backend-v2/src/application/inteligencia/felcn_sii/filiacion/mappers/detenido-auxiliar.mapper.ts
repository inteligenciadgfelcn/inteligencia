import { DeepPartial } from 'typeorm'
import { CreateFiliacionDto } from '../dto/create-filiacion.dto'
import { DetenidoAuxiliar } from '@/application/sunesis/siii/seguimiento/personas/entity/detenido-auxiliar.entity'

function convertirImagenABuffer(imagen?: string | null): Buffer | undefined {
  if (!imagen?.trim()) {
    return undefined
  }

  const base64 = imagen.includes(',') ? imagen.split(',')[1] : imagen

  return Buffer.from(base64, 'base64')
}

export function mapDetenidoAuxiliarEntity(
  dto: CreateFiliacionDto
): DeepPartial<DetenidoAuxiliar> {
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
    arrestado,
    idPais,
    idEstadoCivil,
  } = dto
  const auditoria = dto as CreateFiliacionDto & {
    usuario?: string
    fechaHoraIngreso?: Date
  }
  return {
    idOperativo:
      arrestado?.idOperativo !== null && arrestado?.idOperativo !== undefined
        ? String(arrestado.idOperativo)
        : undefined,

    idPais,
    idEstadoCivil,

    numeroCaso,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    apellidoEsposo,

    esMasculino: genero,
    fechaNacimiento,
    direccion,
    observaciones: observacion,

    serie: detenido?.serie,
    seccion: detenido?.seccion,

    tieneTarjeta: detenido?.tieneTarjeta,
    estaVivo: detenido?.estaVivo,

    fotoFrente: convertirImagenABuffer(detenido?.fotoFrente),

    fotoPerfilDerecho: convertirImagenABuffer(detenido?.fotoPerfilDerecho),

    fotoPerfilIzquierdo: convertirImagenABuffer(detenido?.fotoPerfilIzquierdo),
    usuario: auditoria.usuario ?? 'SISTEMA',
    fechaHoraIngreso: auditoria.fechaHoraIngreso ?? new Date(),
  }
}
