import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { RecursoExcepcion } from '../entity/recurso-excepcion.entity'

@Injectable()
export class RecursoExcepcionRepository {
  constructor(private dataSource: DataSource) {}

  /**
   * Ids de `casbin_rule` excluidos para una combinación usuario+rol puntual.
   */
  async obtenerPoliticasExceptuadas(
    idUsuarioRol: string,
    transaction?: EntityManager
  ): Promise<number[]> {
    const repo =
      transaction?.getRepository(RecursoExcepcion) ??
      this.dataSource.getRepository(RecursoExcepcion)

    const excepciones = await repo
      .createQueryBuilder('excepcion')
      .select('excepcion.id_politica', 'idPolitica')
      .where('excepcion.id_usuario_rol = :idUsuarioRol', { idUsuarioRol })
      .getRawMany<{ idPolitica: number }>()

    return excepciones.map((e) => e.idPolitica)
  }

  async excluir(
    idUsuarioRol: string,
    idPolitica: number,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo =
      transaction?.getRepository(RecursoExcepcion) ??
      this.dataSource.getRepository(RecursoExcepcion)

    const excepcion = new RecursoExcepcion({
      idUsuarioRol,
      idPolitica,
      usuarioCreacion: usuarioAuditoria,
    })
    return await repo.save(excepcion)
  }

  /**
   * "Reactivar" el recurso = eliminar físicamente la excepción. No existe
   * un estado intermedio: la fila deja de existir, punto.
   *
   * Se carga la entidad y se borra con `.remove()` (no un DELETE masivo por
   * query builder) a propósito: el subscriber de auditoría solo captura el
   * contenido completo de la fila borrada cuando pasa por una entidad
   * cargada — un DELETE masivo deja el registro de auditoría vacío.
   */
  async reactivar(
    idUsuarioRol: string,
    idPolitica: number,
    transaction?: EntityManager
  ) {
    const repo =
      transaction?.getRepository(RecursoExcepcion) ??
      this.dataSource.getRepository(RecursoExcepcion)

    const excepcion = await repo.findOne({
      where: { idUsuarioRol, idPolitica },
    })
    if (!excepcion) {
      return null
    }
    return await repo.remove(excepcion)
  }
}
