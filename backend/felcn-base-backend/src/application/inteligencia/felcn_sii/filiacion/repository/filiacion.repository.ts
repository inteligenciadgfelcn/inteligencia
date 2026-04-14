import { Injectable } from '@nestjs/common'
import { AliasDetenido } from '../alias_detenido/entities/alias_detenido.entity'
import { DocumentoDetenido } from '../documento_detenido/entities/documento_detenido.entity'
import { Detenido } from '../detenido/entities/detenido.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FiliacionRepository {
  constructor(
    @InjectRepository(Detenido, DB_SII)
    private detenidoRepository: Repository<Detenido>
  ) {}

  async crearAlias(manager: any, alias: any, detenido: Detenido) {
    return manager.save(
      AliasDetenido,
      manager.create(AliasDetenido, {
        descripcion: alias.alias,
        detenido,
      })
    )
  }

  async crearDocumento(manager: any, documento: any, detenido: Detenido) {
    const { idTipoDocumento, ...docData } = documento

    return manager.save(
      DocumentoDetenido,
      manager.create(DocumentoDetenido, {
        ...docData,
        detenido,
        tipoDocumento: { idTipoDocumento },
      })
    )
  }

  async obtenerDetenido(id: number) {
    const detenido = await this.detenidoRepository.findOne({
      where: { idDetenido: id },
      select: {
        idDetenido: true,
        nombres: true,
        numeroCaso: true,
      },
      relations: {
        aliases: true,
        documentos: {
          tipoDocumento: true,
        },
        fenotipo: {
          tipoNariz: true,
          constitucionCorporal: true,
          colorPiel: true,
          colorCabello: true,
          tipoCabello: true,
          colorOjos: true,
          tipoOjos: true,
        },
        profesiones: {
          idProfesion: true,
        },
        datosFamiliares: {
          parentezco: true,
        },
        nombresSupuestos: true,
      },
    })

    if (!detenido) {
      throw new Error('Detenido no encontrado')
    }

    return this.mapRespuestaDetenido(detenido)
  }

  private mapRespuestaDetenido(d: Detenido) {
    return {
      id: d.idDetenido,
      nombres: d.nombres,
      numeroCaso: d.numeroCaso,

      alias: d.aliases?.map((a) => a.descripcion) ?? [],

      documentos:
        d.documentos?.map((doc) => ({
          numero: doc.numeroDocumento,
          tipo: doc.tipoDocumento?.descripcion,
          expedido: doc.expedido,
        })) ?? [],

      fenotipo: d.fenotipo
        ? {
            estatura: d.fenotipo.estatura,
            peso: d.fenotipo.pesoCorporal,
            senas: d.fenotipo.senasParticulares,

            nariz: d.fenotipo.tipoNariz?.descripcion,
            contextura: d.fenotipo.constitucionCorporal?.descripcion,
            piel: d.fenotipo.colorPiel?.descripcion,
            cabello: d.fenotipo.colorCabello?.descripcion,
            tipoCabello: d.fenotipo.tipoCabello?.descripcion,
            ojos: d.fenotipo.colorOjos?.descripcion,
            tipoOjos: d.fenotipo.tipoOjos?.descripcion,
          }
        : null,

      profesiones:
        d.profesiones?.map((p) => ({
          id: p.idProfesion?.idProfesion,
          descripcion: p.idProfesion?.descripcion,
        })) ?? [],

      datosFamiliares:
        d.datosFamiliares?.map((df) => ({
          id: df.idDatosFamiliares,
          nombres: df.nombres,
          paterno: df.paterno,
          materno: df.materno,
          edad: df.edad,
          direccion: df.direccion,
          telefono: df.telefono,
          vivo: df.vivo,
          implicado: df.implicado,

          parentezco: df.parentezco?.descripcion,
        })) ?? [],
      nombresSupuestos:
        d.nombresSupuestos?.map((ns) => ({
          id: ns.idNombresSupuestos,
          nombres: ns.nombres,
          paterno: ns.paterno,
          materno: ns.materno,
          apellidoEsposo: ns.apellidoEsposo,
          cpq: ns.cpq,
        })) ?? [],
    }
  }
}
