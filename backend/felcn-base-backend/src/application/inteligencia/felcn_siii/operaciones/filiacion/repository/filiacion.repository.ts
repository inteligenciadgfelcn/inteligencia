import { Injectable } from "@nestjs/common"
import { AliasDetenido } from "../alias_detenido/entities/alias_detenido.entity"
import { DocumentoDetenido } from "../documento_detenido/entities/documento_detenido.entity"

@Injectable()
export class FiliacionRepository {

  async crearAlias(manager, alias, detenido) {
    return manager.save(
      AliasDetenido,
      manager.create(AliasDetenido, {
        descripcion: alias.alias,
        detenido,
      })
    )
  }

  async crearDocumento(manager, documento, detenido) {

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

}