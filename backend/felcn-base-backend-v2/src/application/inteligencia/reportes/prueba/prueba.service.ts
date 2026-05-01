import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { convertirWSQaPNG, imagenBase64 } from '@/common/utils/huella.util'
import { Detenido } from '../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../felcn_sii/huella/entities/huella.entity'
import { DB_SII } from '@/core/config/database/database.module'

@Injectable()
export class PruebaService {
  constructor(
    @InjectRepository(Detenido,DB_SII)
    private readonly repoDetenido: Repository<Detenido>,

    @InjectRepository(Huella,DB_SII)
    private readonly huellaRepository: Repository<Huella>,
  ) {}

  async GenerarPDF(id: number) {
    const detenido = await this.obtenerDetenido(id)

    // 🔍 HUELLAS
    const huellas = await this.huellaRepository.find({
      where: { idPersona: id },
    })

    const huellasProcesadas = huellas.map((h) => {
      const rutaWSQ = h.rutaArchivo
      const rutaPNG = rutaWSQ.replace('.wsq', '.png')

      // 🔥 evita reconvertir siempre
      convertirWSQaPNG(rutaWSQ, rutaPNG)

      return {
        dedo: h.dedo,
        imagen: imagenBase64(rutaPNG),
      }
    })

    // 🧠 MAPEO POR MANO
    const manoDerecha: Record<string, string> = {}
    const manoIzquierda: Record<string, string> = {}

    huellasProcesadas.forEach((h) => {
      if (h.dedo?.includes('DER')) {
        manoDerecha[h.dedo] = h.imagen
      } else {
        manoIzquierda[h.dedo] = h.imagen
      }
    })

    return {
      nombre: `${detenido.nombres || ''} ${detenido.apellidoPaterno || ''}`,
      alias: detenido.aliases?.[0]?.descripcion || '',
      nacionalidad: detenido.pais || '',
      fechaNacimiento: detenido.fechaNacimiento || '',
      estadoCivil: detenido.estadoCivil || '',
      profesion: detenido.profesiones?.[0]?.idProfesion.descripcion|| '',

      nombreCaso: detenido.nombresSupuestos || '',
      numeroCaso: detenido.numeroCaso || '',

      // 🔥 CORREGIDO (BYTEA → BASE64)
      fotoFrontal: this.bufferToBase64(detenido.fotoFrente),
      fotoPerfil: this.bufferToBase64(detenido.fotoPerfilDerecho),

      observaciones: detenido.observaciones || '',

      manoDerecha,
      manoIzquierda,
    }
  }

  // 🔥 CONVERSIÓN BYTEA → BASE64
  private bufferToBase64(buffer: any, mime = 'image/jpeg'): string {
    if (!buffer) return ''

    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
    return `data:${mime};base64,${buf.toString('base64')}`
  }

  // 🔍 OBTENER DETENIDO
  private async obtenerDetenido(id: number) {
    const detenido = await this.repoDetenido.findOne({
      where: { idDetenido: id },
      relations: ['aliases', 'profesiones'],
    })

    if (!detenido) {
      throw new Error('Detenido no encontrado')
    }

    return detenido
  }
}