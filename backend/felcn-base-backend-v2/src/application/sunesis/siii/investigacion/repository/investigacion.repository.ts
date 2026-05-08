import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { Operativo } from '../../operativo/entity/operativo.entity'
import { InvestigacionParalela } from '../entity/investigacion-paralela.entity'
import { Investigador } from '../entity/investigador.entity'
import { PaginacionQueryDto } from '@/common/dto'
import { BuscarAsignacionQueryDto } from '../dto/buscar-asignacion-query.dto'

@Injectable()
export class InvestigacionRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  private get repo() {
    return this.dataSource.getRepository(InvestigacionParalela)
  }

  // // ==================== ASIGNACION ====================

  // /**
  //  * Lista investigadores (rol = 'I') de una unidad.
  //  * Origen: asignados() — PAR-REG-CASO.aspx.cs
  //  * Join: investigador → grado → asignacion (para filtrar por unidad)
  //  */
  // async listarInvestigadoresPorUnidad(abreviaturaUnidad: string): Promise<{ usuario: string; nombreCompleto: string }[]> {
  //   return this.dataSource.query(
  //     `SELECT DISTINCT
  //        inv.usuario,
  //        TRIM(g.abreviatura) || ' ' || TRIM(inv.nombre_app) AS "nombreCompleto"
  //      FROM public.investigador inv
  //      INNER JOIN parametricas.grado g ON inv.id_grado = g.id_grado
  //      INNER JOIN public.asignacion a ON inv.id_caso = a.id_caso
  //      WHERE TRIM(a.abreviatura_unidad) = TRIM($1)
  //      ORDER BY inv.id_grado`,
  //     [abreviaturaUnidad]
  //   )
  // }

  /**
   * Busca casos de la tabla ASIGNACION con distintos criterios.
   * Origen: Button1/3/5/6/8/9_Click — PAR-REG-CASO.aspx.cs
   *
   * Reglas de filtro:
   *  - investigador → JOIN con investigador, SIN filtro de unidad, ORDER BY nroOperativo
   *  - resto         → filtro por abreviaturaUnidad del JWT, ORDER BY id
   */
  async buscarAsignacion(filtros: BuscarAsignacionQueryDto): Promise<Record<string, unknown>[]> {
    const params: unknown[] = []

    const selects = `
      SELECT
        a.id_caso                              AS "id",
        u.descripcion                          AS "unidad",
        d.descripcion                          AS "distrital",
        a.numero_operativo                     AS "nroOperativo",
        a.nombre_caso                          AS "nombreCaso",
        a.numero_caso                          AS "numeroCaso",
        a.asignado_caso                        AS "asignadoCaso",
        a.fiscal_asignado_caso                 AS "fiscalAsignadoCaso",
        TRIM(a.id_departamento_caso)           AS "idDepartamentoCaso",
        TRIM(a.abreviatura_unidad)             AS "abreviaturaUnidad",
        a.id_distrital                         AS "idDistrital",
        a.id_grupo                             AS "idGrupo"
      FROM public.asignacion a
      INNER JOIN public.unidad    u ON TRIM(a.abreviatura_unidad) = TRIM(u.abreviatura)
      INNER JOIN public.distrital d ON a.id_distrital = d.id_distrital`

    if (filtros.investigador) {
      // Button3_Click: JOIN con investigador, sin filtro de unidad
      params.push(filtros.investigador)
      const sql = `
        ${selects}
        INNER JOIN public.investigador inv ON a.id_caso = inv.id_caso
        WHERE TRIM(inv.usuario) = TRIM($${params.length})
        ORDER BY a.numero_operativo ASC`
      return this.dataSource.query(sql, params)
    }

    // Todos los demás botones: filtro por unidad obligatorio
    params.push(filtros.abreviaturaUnidad)
    let condicion = `TRIM(a.abreviatura_unidad) = TRIM($${params.length})`

    if (filtros.nroCaso) {
      // Button1_Click: por Nro. Caso FELCN exacto
      params.push(filtros.nroCaso.trim().toUpperCase())
      condicion += ` AND TRIM(a.numero_caso) = TRIM($${params.length})`
    } else if (filtros.nombreCaso) {
      // Button6_Click: por nombre parcial, solo casos con NroCaso o NroCasoPerDom válido
      params.push(`%${filtros.nombreCaso.trim().toUpperCase()}%`)
      condicion += ` AND (TRIM(a.numero_caso) != '*' OR TRIM(a.numero_caso_per_dom) != '*')`
      condicion += ` AND a.nombre_caso ILIKE $${params.length}`
    } else if (filtros.nroCasoPerdidaDominio) {
      // Button8_Click: por Nro. Caso Perdida de Dominio exacto
      params.push(filtros.nroCasoPerdidaDominio.trim().toUpperCase())
      condicion += ` AND TRIM(a.numero_caso_per_dom) = TRIM($${params.length})`
    } else if (filtros.nroOperativo) {
      // Button9_Click: por Nro. de Operativo exacto
      params.push(filtros.nroOperativo.trim().toUpperCase())
      condicion += ` AND TRIM(a.numero_operativo) = TRIM($${params.length})`
    } else {
      // Button5_Click / Mostrar Todos: casos con NroCaso o NroCasoPerDom válidos
      condicion += ` AND (TRIM(a.numero_caso) != '*' OR TRIM(a.numero_caso_per_dom) != '*')`
    }

    const sql = `${selects} WHERE ${condicion} ORDER BY a.id_caso ASC`
    return this.dataSource.query(sql, params)
  }

  /**
   * Lista operativos de un caso seleccionado.
   * Origen: MuestraOperativos() — PAR-REG-CASO.aspx.cs
   * Join: departamento, provincia, localidad, unidad, distrital (relaciones declaradas en Operativo)
   */
  async listarOperativosPorCaso(idCaso: string): Promise<Operativo[]> {
    return this.dataSource
      .getRepository(Operativo)
      .createQueryBuilder('op')
      .leftJoinAndSelect('op.departamento', 'dep')
      .leftJoinAndSelect('op.provincia', 'prov')
      .leftJoinAndSelect('op.localidad', 'loc')
      .leftJoinAndSelect('op.unidad', 'u')
      .leftJoinAndSelect('op.distrital', 'd')
      .where('op.idCaso = :idCaso', { idCaso })
      .getMany()
  }

  // ==================== INVESTIGACION PARALELA ====================

  async crearInvestigacionParalela(
    investigacion: Partial<InvestigacionParalela>
  ): Promise<InvestigacionParalela> {
    const nueva = this.repo.create(investigacion)
    return this.repo.save(nueva)
  }

  async listar(
    paginacion: PaginacionQueryDto
  ): Promise<[InvestigacionParalela[], number]> {
    return this.repo.findAndCount({
      skip: paginacion.saltar,
      take: paginacion.limite,
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async buscarPorId(id: string): Promise<InvestigacionParalela | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['asignacion', 'operativo'],
    })
  }

  async actualizarInvestigacionParalela(
    investigacion: Partial<InvestigacionParalela>
  ): Promise<InvestigacionParalela> {
    return this.repo.save(investigacion)
  }

  /**
   * Lista investigaciones paralelas filtradas por unidad y estado.
   * Origen: Muestracasos() — PAR-ING/JUD/RECH-CASO.aspx.cs
   *
   * PAR-ING: resultado=false,  respuesta=undefined
   * PAR-JUD: resultado=true,   respuesta=true
   * PAR-RECH: resultado=true,  respuesta=false
   */
  async listarPorEstado(
    abreviaturaUnidad: string,
    resultado: boolean,
    paginacion: PaginacionQueryDto,
    respuestaInvestigacionParalela?: boolean
  ): Promise<[InvestigacionParalela[], number]> {
    const qb = this.dataSource
      .getRepository(InvestigacionParalela)
      .createQueryBuilder('ip')
      .leftJoinAndSelect('ip.departamento', 'dep')
      .leftJoinAndSelect('ip.unidad', 'u')
      .leftJoinAndSelect('ip.distrital', 'dist')
      .leftJoinAndSelect('ip.grupo', 'g')
      .where('TRIM(ip.abreviaturaUnidad) = TRIM(:abreviaturaUnidad)', { abreviaturaUnidad })
      .andWhere('ip.resultado = :resultado', { resultado })

    // PAR-ING-CASO no filtra por respuestaInvestigacionParalela (solo Resultado = 0)
    // PAR-JUD y PAR-RECH sí lo requieren
    if (respuestaInvestigacionParalela !== undefined) {
      qb.andWhere('ip.respuestaInvestigacionParalela = :respuestaInvestigacionParalela', {
        respuestaInvestigacionParalela,
      })
    }

    return qb
      .orderBy('ip.fechaEnvioInvestigacionParalela', 'ASC')
      .skip(paginacion.saltar)
      .take(paginacion.limite)
      .getManyAndCount()
  }

  // ==================== INVESTIGADOR ====================

  private get investigadorRepo() {
    return this.dataSource.getRepository(Investigador)
  }

  async crearInvestigador(investigador: Partial<Investigador>): Promise<Investigador> {
    const nuevo = this.investigadorRepo.create(investigador)
    return this.investigadorRepo.save(nuevo)
  }

  async listarInvestigadoresPorCaso(idCaso: string): Promise<Investigador[]> {
    return this.investigadorRepo.find({
      where: { idCaso },
      relations: ['grado'],
      order: { fecha: 'DESC' },
    })
  }
}
