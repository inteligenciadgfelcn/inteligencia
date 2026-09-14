import { Injectable, NotFoundException } from '@nestjs/common'
import { Detenido } from '../../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { DetenidoReporteRepository } from '../repository/detenido-reporte.repository'
import { imagenBase64 } from '@/common/utils/huella.util'

@Injectable()
export class DetenidoReporteService {
  constructor(private readonly repository: DetenidoReporteRepository) {}

  async obtenerDetalle(idDetenido: number) {
    const [detenido, huellas] = await Promise.all([
      this.repository.obtenerDetenido(idDetenido),
      this.repository.obtenerHuellas(idDetenido),
    ])

    if (!detenido) {
      throw new NotFoundException(`No se encontró el detenido ${idDetenido}`)
    }
    return await this.mapearRespuesta(detenido, huellas)
  }

  private async mapearRespuesta(detenido: Detenido, huellas: any[]) {
    const huellasBase64 = await Promise.all(
      huellas.map(async (huella) => {
        const imagen = await imagenBase64(huella.ruta_archivo)
        return {
          id: this.numeroNullable(huella.id_huella),
          dedo: huella.dedo ?? '',
          calidad: this.numeroNullable(huella.calidad),
          imagen: imagen || null,
        }
      })
    )

    return {
      idDetenido: detenido.idDetenido,
      numeroCaso: detenido.numeroCaso,
      datosPersonales: {
        nombres: detenido.nombres ?? '',
        apellidoPaterno: detenido.apellidoPaterno ?? '',
        apellidoMaterno: detenido.apellidoMaterno ?? '',
        apellidoEsposo: detenido.apellidoEsposo ?? '',
        nombreCompleto: this.construirNombreCompleto(detenido),
        fechaNacimiento: detenido.fechaNacimiento ?? null,
        pais: detenido.pais?.descripcion ?? null,
        estadoCivil: detenido.estadoCivil?.descripcion ?? null,
        direccion: detenido.direccion ?? '',
        estaVivo: detenido.estaVivo ?? null,
        tieneTarjeta: detenido.tieneTarjeta ?? null,
        fechaIngreso: detenido.fechaHoraIngreso ?? null,
      },
      aliases:
        detenido.aliases?.map((alias) => ({
          id: alias.idAliasDetenido,
          descripcion: alias.descripcion ?? '',
        })) ?? [],
      documentos:
        detenido.documentos?.map((documento) => ({
          id: documento.idDocumentoDetenido,
          numero: documento.numeroDocumento ?? '',
          tipo: documento.tipoDocumento?.descripcion ?? null,
          expedido: documento.expedido ?? null,
          contrastadoSegip: documento.contrastadoSegip ?? null,
        })) ?? [],
      fenotipo: detenido.fenotipo
        ? {
            estatura: detenido.fenotipo.estatura ?? null,
            peso: detenido.fenotipo.pesoCorporal ?? null,
            senasParticulares: detenido.fenotipo.senasParticulares ?? '',
            nariz: detenido.fenotipo.tipoNariz?.descripcion ?? null,
            constitucionCorporal:
              detenido.fenotipo.constitucionCorporal?.descripcion ?? null,
            colorPiel: detenido.fenotipo.colorPiel?.descripcion ?? null,
            colorCabello: detenido.fenotipo.colorCabello?.descripcion ?? null,
            tipoCabello: detenido.fenotipo.tipoCabello?.descripcion ?? null,
            colorOjos: detenido.fenotipo.colorOjos?.descripcion ?? null,
            tipoOjos: detenido.fenotipo.tipoOjos?.descripcion ?? null,
          }
        : null,
      profesiones:
        detenido.profesiones?.map((profesion) => ({
          id: profesion.idProfesion?.idProfesion ?? null,
          descripcion: profesion.idProfesion?.descripcion ?? null,
        })) ?? [],
      familiares:
        detenido.datosFamiliares?.map((familiar) => ({
          id: familiar.idDatosFamiliares,
          nombres: familiar.nombres ?? '',
          apellidoPaterno: familiar.paterno ?? '',
          apellidoMaterno: familiar.materno ?? '',
          edad: familiar.edad ?? null,
          direccion: familiar.direccion ?? '',
          telefono: familiar.telefono ?? '',
          estaVivo: familiar.vivo ?? null,
          implicado: familiar.implicado ?? null,
          parentesco: familiar.parentezco?.descripcion ?? null,
        })) ?? [],
      nombresSupuestos:
        detenido.nombresSupuestos?.map((nombre) => ({
          id: nombre.idNombresSupuestos,
          nombres: nombre.nombres ?? '',
          apellidoPaterno: nombre.paterno ?? '',
          apellidoMaterno: nombre.materno ?? '',
          apellidoEsposo: nombre.apellidoEsposo ?? '',
          cpq: nombre.cpq ?? null,
        })) ?? [],
      huellas: huellasBase64,
    }
  }

  private construirNombreCompleto(detenido: Detenido): string {
    return [
      detenido.nombres,
      detenido.apellidoPaterno,
      detenido.apellidoMaterno,
      detenido.apellidoEsposo,
    ]
      .map((valor) => String(valor ?? '').trim())
      .filter(Boolean)
      .join(' ')
  }

  private numeroNullable(valor: unknown): number | null {
    if (valor === null || valor === undefined || valor === '') {
      return null
    }

    const numero = Number(valor)

    return Number.isNaN(numero) ? null : numero
  }
}
