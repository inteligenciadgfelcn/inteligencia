import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import { Detenido } from '../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../felcn_sii/huella/entities/huella.entity'
import { DB_SII } from '@/core/config/database/database.module'

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Detenido, DB_SII)
    private readonly repoDetenido: Repository<Detenido>,

    @InjectRepository(Huella, DB_SII)
    private readonly huellaRepository: Repository<Huella>
  ) {}

  async GenerarPDF(id: number) {
    const [
      detenido,
      fenotipoData,
      familiaresData,
      documentosData,
      nombresData,
      huellas,
    ] = await Promise.all([
      this.obtenerDetenido(id),
      this.obtenerFenotipo(id),
      this.obtenerFamiliares(id),
      this.obtenerDocumentos(id),
      this.obtenerNombresSupuestos(id),
      this.obtenerHuellas(id),
    ])

    const manoDerecha: Record<string, string> = {}
    const manoIzquierda: Record<string, string> = {}
    for (const h of huellas) {
      const imagen = await this.imagenBase64Optimizada(h.rutaArchivo)

      if (h.dedo?.includes('Derecho')) {
        manoDerecha[h.dedo] = imagen
      } else {
        manoIzquierda[h.dedo] = imagen
      }
    }
    const fotoFrontal = this.bufferToBase64(detenido?.fotoFrente)
    const fotoPerfil = this.bufferToBase64(detenido?.fotoPerfilDerecho)
    const fotoPerfilIzquierdo = this.bufferToBase64(
      detenido?.fotoPerfilIzquierdo
    )

    const nombresSupuestos =
      nombresData?.nombresSupuestos
        ?.map((n) =>
          [n.nombres, n.paterno, n.materno, n.apellidoEsposo]
            .filter(Boolean)
            .join(' ')
        )
        .join(' | ') || ''

    const datosFamiliares =
      familiaresData?.datosFamiliares?.map((f) => ({
        nombreCompleto: [f.nombres, f.paterno, f.materno]
          .filter(Boolean)
          .join(' '),
        parentesco: f.parentezco?.descripcion || '',
        telefono: f.telefono || '',
        direccion: f.direccion || '',
        implicado: f.implicado === true ? 'SI' : 'NO',
        estado: f.vivo === true ? 'VIVO' : 'MUERTO',
      })) || []

    const documentos =
      documentosData?.documentos?.map((d) => ({
        tipoDocumento: d.tipoDocumento?.descripcion || '',
        numeroDocumento: d.numeroDocumento || '',
      })) || []

    const fenotipo = fenotipoData?.fenotipo
    return {
      nombre: [
        detenido?.nombres,
        detenido?.apellidoPaterno,
        detenido?.apellidoMaterno,
      ]
        .filter(Boolean)
        .join(' '),

      alias: detenido?.aliases?.[0]?.descripcion || '',
      numeroCaso: detenido?.numeroCaso || '',
      direccion: detenido?.direccion || '',
      lugarOperativo: detenido?.lugarOperativo || '',
      observaciones: detenido?.observaciones || '',
      fechaNacimiento: detenido?.fechaNacimiento || '',
      nacionalidad: detenido?.pais?.descripcion || '',
      estadoCivil: detenido?.estadoCivil?.descripcion || '',
      profesion: detenido?.profesiones?.[0]?.idProfesion?.descripcion || '',
      fotoFrontal,
      fotoPerfil,
      fotoPerfilIzquierdo,
      manoDerecha,
      manoIzquierda,
      nombresSupuestos,
      datosFamiliares,
      documentos,
      estatura: fenotipo?.estatura || '',
      peso: fenotipo?.pesoCorporal || '',
      colorPiel: fenotipo?.colorPiel?.descripcion || '',
      colorCabello: fenotipo?.colorCabello?.descripcion || '',
      tipoCabello: fenotipo?.tipoCabello?.descripcion || '',
      colorOjos: fenotipo?.colorOjos?.descripcion || '',
      tipoOjos: fenotipo?.tipoOjos?.descripcion || '',
      tipoNariz: fenotipo?.tipoNariz?.descripcion || '',
      constitucionCorporal: fenotipo?.constitucionCorporal?.descripcion || '',
      seniasParticulares: fenotipo?.senasParticulares || '',
      tatuajes: fenotipo?.tatuaje || '',
    }
  }

  private async obtenerDetenido(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },
      relations: [
        'aliases',
        'pais',
        'estadoCivil',
        'profesiones',
        'profesiones.idProfesion',
      ],
    })
  }

  private async obtenerFenotipo(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },
      relations: [
        'fenotipo',
        'fenotipo.colorPiel',
        'fenotipo.colorCabello',
        'fenotipo.tipoCabello',
        'fenotipo.colorOjos',
        'fenotipo.tipoOjos',
        'fenotipo.tipoNariz',
        'fenotipo.constitucionCorporal',
      ],
    })
  }

  private async obtenerFamiliares(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },
      relations: ['datosFamiliares', 'datosFamiliares.parentezco'],
    })
  }

  private async obtenerDocumentos(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },
      relations: ['documentos', 'documentos.tipoDocumento'],
    })
  }

  private async obtenerNombresSupuestos(id: number) {
    return await this.repoDetenido.findOne({
      where: {
        idDetenido: id,
      },

      relations: ['nombresSupuestos'],
    })
  }

  private async obtenerHuellas(id: number) {
    return await this.huellaRepository.find({
      where: {
        idPersona: id,
      },
    })
  }

  private bufferToBase64(buffer: any, mime = 'image/png'): string {
    if (!buffer) return ''
    const text = Buffer.isBuffer(buffer) ? buffer.toString() : buffer.toString()
    if (text.startsWith('iVBOR') || text.startsWith('/9j/')) {
      return `data:${mime};base64,${text}`
    }
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
    return `data:${mime};base64,${buf.toString('base64')}`
  }

  private async imagenBase64Optimizada(path: string): Promise<string> {
    const cacheB64 = `${path}.b64`
    if (fs.existsSync(cacheB64)) {
      return fs.readFileSync(cacheB64, 'utf8')
    }
    if (!fs.existsSync(path)) {
      return ''
    }
    const bitmap = fs.readFileSync(path)
    const extension = path.split('.').pop()?.toLowerCase()
    let mime = 'image/png'
    if (extension === 'bmp') {
      mime = 'image/bmp'
    }
    if (extension === 'jpg' || extension === 'jpeg') {
      mime = 'image/jpeg'
    }
    if (extension === 'png') {
      mime = 'image/png'
    }
    const base64 = `data:${mime};base64,${bitmap.toString('base64')}`
    fs.writeFileSync(cacheB64, base64)
    return base64
  }
}
