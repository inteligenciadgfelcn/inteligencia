import { BaseService } from '@/common/base'
import { BadRequestException, Injectable, Query } from '@nestjs/common'
import { DataSource, EntityManager, In } from 'typeorm'
import { AuthZManagementService } from 'nest-authz'
import { FiltrosPoliticasDto } from '../dto/filtros-politicas.dto'
import { ModuloService } from '../service/modulo.service'
import { PoliticaDto } from '../dto/politica.dto'
import { CasbinRule } from '../entity/casbin.entity'
import { Modulo } from '../entity/modulo.entity'
import { RecursoExcepcionRepository } from '../repository/recurso-excepcion.repository'

type politicasResultType = [Array<PoliticaDto>, number]

@Injectable()
export class AuthorizationService extends BaseService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    private readonly moduloService: ModuloService,
    private readonly recursoExcepcionRepositorio: RecursoExcepcionRepository,
    private readonly dataSource: DataSource
  ) {
    super()
  }

  async listarPoliticas(
    @Query() paginacionQueryDto: FiltrosPoliticasDto
  ): Promise<politicasResultType> {
    const { limite, pagina, filtro, aplicacion, orden, descendente } =
      paginacionQueryDto

    const politicas = await this.authZManagerService.getPolicy()

    let result = politicas.map((politica) => ({
      sujeto: politica[0],
      objeto: politica[1],
      accion: politica[2],
      app: politica[3],
    }))

    switch (orden) {
      case 'sujeto':
        result = result.sort((a, b) => {
          const compareResult = a.sujeto.localeCompare(b.sujeto)
          return descendente ? -compareResult : compareResult
        })
        break
      case 'objeto':
        result = result.sort((a, b) => {
          const compareResult = a.objeto.localeCompare(b.objeto)
          return descendente ? -compareResult : compareResult
        })
        break
      case 'accion':
        result = result.sort((a, b) => {
          const compareResult = a.accion.localeCompare(b.accion)
          return descendente ? -compareResult : compareResult
        })
        break
      case 'app':
        result = result.sort((a, b) => {
          const compareResult = a.app.localeCompare(b.app)
          return descendente ? -compareResult : compareResult
        })
        break
    }

    if (filtro) {
      result = result.filter(
        (r) =>
          r.sujeto.toLowerCase().includes(filtro.toLowerCase()) ||
          r.objeto.toLowerCase().includes(filtro.toLowerCase()) ||
          r.accion.toLowerCase().includes(filtro.toLowerCase()) ||
          r.app.toLowerCase().includes(filtro.toLowerCase())
      )
    }
    if (aplicacion) {
      result = result.filter((r) =>
        r.app.toLowerCase().includes(aplicacion.toLowerCase())
      )
    }

    if (!limite || !pagina) {
      return [result, result.length]
    }
    const i = limite * (pagina - 1)
    const f = limite * pagina

    const subset = result.slice(i, f)
    return [subset, result.length]
  }

  async crearPolitica(politica: PoliticaDto) {
    const { sujeto, objeto, accion, app } = politica
    await this.authZManagerService.addPolicy(sujeto, objeto, accion, app)
    return politica
  }

  async actualizarPolitica(politica: PoliticaDto, politicaNueva: PoliticaDto) {
    // UPDATE en el lugar (preserva el id de casbin_rule) en vez de borrar+crear.
    // Necesario para que `recurso_excepcion.id_politica` no quede huérfana ni
    // se borre en cascada por una simple edición de política.
    const reglaVieja = [
      politica.sujeto,
      politica.objeto,
      politica.accion,
      politica.app,
    ]
    const reglaNueva = [
      politicaNueva.sujeto,
      politicaNueva.objeto,
      politicaNueva.accion,
      politicaNueva.app,
    ]
    await this.authZManagerService.updatePolicy(reglaVieja, reglaNueva)
  }

  async eliminarPolitica(politica: PoliticaDto) {
    const { sujeto, objeto, accion, app } = politica
    await this.authZManagerService.removePolicy(sujeto, objeto, accion, app)
    return politica
  }

  async obtenerRoles() {
    return await this.authZManagerService.getFilteredPolicy(3, 'frontend')
  }

  async obtenerPermisosPorRol(rol: string, idUsuarioRol: string) {
    // Se consulta casbin_rule directo (no vía el enforcer) porque acá además
    // del match por URL hace falta el id de la política, para poder cruzarlo
    // contra las excepciones del usuario+rol.
    const politicasRol = await this.dataSource.getRepository(CasbinRule).find({
      where: { ptype: 'p', v0: rol, v3: 'frontend' },
    })
    const politicaIdPorUrl = new Map(
      politicasRol.map((politica) => [politica.v1, politica.id])
    )

    const politicasExceptuadas = new Set(
      await this.recursoExcepcionRepositorio.obtenerPoliticasExceptuadas(
        idUsuarioRol
      )
    )

    const modulos = await this.moduloService.listarTodo()
    return modulos
      .map((modulo) => ({
        ...modulo,
        subModulo: modulo.subModulo.filter((subModulo) => {
          const idPolitica = politicaIdPorUrl.get(subModulo.url)
          return (
            idPolitica !== undefined && !politicasExceptuadas.has(idPolitica)
          )
        }),
      }))
      .filter((modulo) => modulo.subModulo.length > 0)
  }

  /**
   * Catálogo de módulos hoja asignables a un rol (los que tienen política
   * frontend propia), anotados con si están excluidos para un usuario+rol
   * puntual. A diferencia de `obtenerPermisosPorRol`, acá NO se filtran los
   * excluidos — se devuelven todos para que el formulario de gestión de
   * excepciones pueda mostrar el checkbox correspondiente ya marcado/desmarcado.
   */
  async obtenerModulosConExcepcion(rol: string, idUsuarioRol?: string) {
    const politicasRol = await this.dataSource.getRepository(CasbinRule).find({
      where: { ptype: 'p', v0: rol, v3: 'frontend' },
    })
    const politicaIdPorUrl = new Map(
      politicasRol.map((politica) => [politica.v1, politica.id])
    )

    // Sin idUsuarioRol (alta de usuario, todavía no existe la fila
    // usuario_rol): no hay nada que pueda estar excluido.
    const politicasExceptuadas = idUsuarioRol
      ? new Set(
          await this.recursoExcepcionRepositorio.obtenerPoliticasExceptuadas(
            idUsuarioRol
          )
        )
      : new Set<number>()

    const modulos = await this.moduloService.listarTodo()
    return modulos
      .map((modulo) => ({
        ...modulo,
        subModulo: modulo.subModulo
          .map((subModulo) => {
            const idPolitica = politicaIdPorUrl.get(subModulo.url)
            return idPolitica === undefined
              ? null
              : {
                  ...subModulo,
                  excluido: politicasExceptuadas.has(idPolitica),
                }
          })
          .filter((subModulo): subModulo is NonNullable<typeof subModulo> =>
            Boolean(subModulo)
          ),
      }))
      .filter((modulo) => modulo.subModulo.length > 0)
  }

  /**
   * Resuelve, para un rol, qué política frontend (`casbin_rule.id`)
   * corresponde a cada `id` de módulo dado — solo devuelve los que
   * efectivamente pertenecen al rol (tienen política propia con esa url).
   * Los módulos que no resuelven quedan afuera del mapa a propósito, para
   * que el llamador pueda detectar intentos de exceptuar un recurso que el
   * rol no tiene (`UserResource ⊆ RoleResource`).
   */
  async resolverPoliticasPorModulos(
    rol: string,
    idsModulo: string[],
    transaccion?: EntityManager
  ): Promise<Map<string, number>> {
    if (idsModulo.length === 0) {
      return new Map()
    }

    const moduloRepo =
      transaccion?.getRepository(Modulo) ??
      this.dataSource.getRepository(Modulo)
    const modulos = await moduloRepo.find({ where: { id: In(idsModulo) } })

    const casbinRepo =
      transaccion?.getRepository(CasbinRule) ??
      this.dataSource.getRepository(CasbinRule)
    const politicas = await casbinRepo.find({
      where: { ptype: 'p', v0: rol, v3: 'frontend' },
    })
    const politicaIdPorUrl = new Map(
      politicas.map((politica) => [politica.v1, politica.id])
    )

    const resultado = new Map<string, number>()
    for (const modulo of modulos) {
      const idPolitica = politicaIdPorUrl.get(modulo.url)
      if (idPolitica !== undefined) {
        resultado.set(modulo.id, idPolitica)
      }
    }
    return resultado
  }

  /**
   * Sincroniza el conjunto de módulos excluidos para un usuario+rol puntual
   * al conjunto exacto recibido (`idsModuloExcluidos`) — agrega las
   * excepciones nuevas y reactiva (borra la fila) las que ya no correspondan.
   * No tocar `recursoExcepcion` para roles no mencionados por el llamador.
   */
  async sincronizarExcepcionesRecurso(
    idUsuarioRol: string,
    rol: string,
    idsModuloExcluidos: string[],
    usuarioAuditoria: string,
    transaccion?: EntityManager
  ) {
    const politicaPorModulo = await this.resolverPoliticasPorModulos(
      rol,
      idsModuloExcluidos,
      transaccion
    )

    if (politicaPorModulo.size !== idsModuloExcluidos.length) {
      throw new BadRequestException(
        'Uno o más recursos a exceptuar no pertenecen a los recursos asignados a este rol'
      )
    }

    const idsPoliticaDeseados = new Set(politicaPorModulo.values())
    const idsPoliticaActuales = new Set(
      await this.recursoExcepcionRepositorio.obtenerPoliticasExceptuadas(
        idUsuarioRol,
        transaccion
      )
    )

    const aExcluir = [...idsPoliticaDeseados].filter(
      (idPolitica) => !idsPoliticaActuales.has(idPolitica)
    )
    const aReactivar = [...idsPoliticaActuales].filter(
      (idPolitica) => !idsPoliticaDeseados.has(idPolitica)
    )

    for (const idPolitica of aExcluir) {
      await this.recursoExcepcionRepositorio.excluir(
        idUsuarioRol,
        idPolitica,
        usuarioAuditoria,
        transaccion
      )
    }
    for (const idPolitica of aReactivar) {
      await this.recursoExcepcionRepositorio.reactivar(
        idUsuarioRol,
        idPolitica,
        transaccion
      )
    }
  }
}
