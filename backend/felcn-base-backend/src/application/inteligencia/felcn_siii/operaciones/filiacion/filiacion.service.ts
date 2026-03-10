import { Injectable } from '@nestjs/common'
import { CreateFiliacionDto } from './dto/create-filiacion.dto'
import { UpdateFiliacionDto } from './dto/update-filiacion.dto'
import { DataSource } from 'typeorm'
import { AliasDetenido } from './alias_detenido/entities/alias_detenido.entity'
import { DocumentoDetenido } from './documento_detenido/entities/documento_detenido.entity'
import { ProfesionDetenido } from './profesion_detenido/entities/profesion_detenido.entity'
import { Detenido } from './detenido/entities/detenido.entity'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { FenotipoDetenido } from './fenotipo_detenido/entities/fenotipo_detenido.entity'
import { mapFenotipoDtoToEntity } from './fenotipo_detenido/mappers/fenotipo-mapper'

@Injectable()
export class FiliacionService {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async create(createFiliacionDto: CreateFiliacionDto) {
  return this.dataSource.transaction(async (manager) => {

    const { detenido: detenidoDto, alias, documento, profesion, fenotipo } = createFiliacionDto

    const { idPais, idEstadoCivil, ...detenidoData } = detenidoDto

    //  Guardar detenido
    const detenido = await manager.save(
      Detenido,
      manager.create(Detenido, {
        ...detenidoData,
        pais: { idPais },
        estadoCivil: { idEstadoCivil },
      })
    )

    const operations: Promise<any>[] = []

    // Alias
    if (alias) {
      operations.push(
        manager.save(
          AliasDetenido,
          manager.create(AliasDetenido, {
            ...alias,
            detenido,
          })
        )
      )
    }

    //  Documento
    if (documento) {
      const { idTipoDocumento, ...docData } = documento

      operations.push(
        manager.save(
          DocumentoDetenido,
          manager.create(DocumentoDetenido, {
            ...docData,
            detenido,
            tipoDocumento: { idTipoDocumento },
          })
        )
      )
    }

    //  Fenotipo
    if (fenotipo) {
      operations.push(
        manager.save(FenotipoDetenido, mapFenotipoDtoToEntity(fenotipo, detenido))
      )
    }

    //  Profesión
    if (profesion) {
      operations.push(
        manager.save(
          ProfesionDetenido,
          manager.create(ProfesionDetenido, {
            ...profesion,
            detenido,
          })
        )
      )
    }

    // Ejecutar operaciones
    await Promise.all(operations)

    return {
      message: 'Filiación registrada correctamente',
      idDetenido: detenido.idDetenido,
    }

  })
}

  findAll() {
    return `This action returns all filiacion`
  }

  findOne(id: number) {
    return `This action returns a #${id} filiacion`
  }

  update(id: number, updateFiliacionDto: UpdateFiliacionDto) {
    return `This action updates a #${id} filiacion`
  }

  remove(id: number) {
    return `This action removes a #${id} filiacion`
  }
}
