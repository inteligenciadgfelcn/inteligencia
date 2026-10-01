import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { AsignacionLgi } from '@/application/lgi/asignacion_lgi/entities/asignacion_lgi.entity'
import { DocumentoContenidoCaso } from '@/application/lgi/asignacion_lgi/entities/docuemnto-contenido-caso.entity'
import { DocumentacionCaso } from '@/application/lgi/asignacion_lgi/entities/documento-caso.entity'
import { RegistrarEtapaProcesalPdDto } from '../dto/etapa-asignacion_pd.dto'

@Injectable()
export class EtapaProcesalPdRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSourceLgi: DataSource
  ) {}

  async registrar(
    casosId: number,
    dto: RegistrarEtapaProcesalPdDto,
    usuario: string,
    documento?: Express.Multer.File
  ) {
    return this.dataSourceLgi.transaction(async (manager) => {
      const asignacionRepository = manager.getRepository(AsignacionLgi)
      const documentacionRepository = manager.getRepository(DocumentacionCaso)
      const contenidoRepository = manager.getRepository(DocumentoContenidoCaso)
      const asignacion = await asignacionRepository.findOne({
        where: {
          casosId,
          estado: 'ACTIVO',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      })

      if (!asignacion) {
        throw new NotFoundException(
          `No existe un caso activo con ID ${casosId}`
        )
      }
      const etapaExiste = await manager
        .createQueryBuilder()
        .select('1', 'existe')
        .from('parametricas.etapainvest', 'etapa')
        .where('etapa.eta_inv = :etapaId', {
          etapaId: dto.etapaId,
        })
        .limit(1)
        .getRawOne()

      if (!etapaExiste) {
        throw new BadRequestException(`No existe la etapa ${dto.etapaId}`)
      }

      let docCasoId: number | null = null
      let documentoContenidoId: number | null = null

      if (documento) {
        const documentacion = documentacionRepository.create({
          casosId,
          descripcion: dto.descripcionDocumento!.trim(),
        })

        const documentacionGuardada =
          await documentacionRepository.save(documentacion)

        docCasoId = documentacionGuardada.docCasoId
        const contenido = contenidoRepository.create({
          docCasoId,
          archivo: documento.buffer,
        })
        const contenidoGuardado = await contenidoRepository.save(contenido)
        documentoContenidoId = contenidoGuardado.documentoCasoId
      }

      // Datos actuales del caso.
      asignacion.idEtapa = dto.etapaId

      if (dto.idEstado !== undefined) {
        asignacion.idEstado = dto.idEstado
      }

      asignacion.fechaRecepcionFiscalia = new Date(dto.fechaRecepcionFiscalia)
      asignacion.diasOtorgados = dto.diasOtorgados
      asignacion.usuarioActualizacion = usuario
      const asignacionGuardada = await asignacionRepository.save(asignacion)

      return {
        message: 'Etapa del caso registrada correctamente',
        casosId: asignacionGuardada.casosId,
        etapaId: asignacionGuardada.idEtapa,
        idEstado: asignacionGuardada.idEstado,
        fechaRecepcionFiscalia: asignacionGuardada.fechaRecepcionFiscalia,
        diasOtorgados: asignacionGuardada.diasOtorgados,
        docCasoId,
        documentoContenidoId,
      }
    })
  }

  async listarPorCaso(casosId: number) {
  const documentos = await this.dataSourceLgi
    .getRepository(DocumentacionCaso)
    .find({
      where: { casosId },
      order: { docCasoId: 'DESC' },
    })

  const contenidoRepository = this.dataSourceLgi
    .getRepository(DocumentoContenidoCaso)

  return Promise.all(
    documentos.map(async (documento) => {
      const contenido = await contenidoRepository.findOne({
        where: { docCasoId: documento.docCasoId },
      })

      const contenidoBase64 = contenido
        ? contenido.archivo.toString('base64')
        : null

      return {
        docCasoId: documento.docCasoId,
        descripcion: documento.descripcion.trim(),
        nombreArchivo: `documento-${documento.docCasoId}.pdf`,
        mimeType: contenido ? 'application/pdf' : null,
        contenidoBase64,
        dataUrl: contenidoBase64
          ? `data:application/pdf;base64,${contenidoBase64}`
          : null,
      }
    }),
  )
}

  async obtenerArchivo(casosId: number, docCasoId: number): Promise<Buffer> {
    // Verifica que el documento pertenezca al caso solicitado.
    const documento = await this.dataSourceLgi
      .getRepository(DocumentacionCaso)
      .findOne({
        where: { casosId, docCasoId },
      })

    if (!documento) {
      throw new NotFoundException('Documento no encontrado para este caso')
    }

    const contenido = await this.dataSourceLgi
      .getRepository(DocumentoContenidoCaso)
      .findOne({
        where: { docCasoId },
      })

    if (!contenido) {
      throw new NotFoundException('El documento no tiene un archivo adjunto')
    }

    return contenido.archivo
  }
}
