import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CasoRepository } from '../repository/caso.repository'
import { S2iAsignacion } from '../entity/asignacion.entity'
import { CreateCasoDto } from '../dto/create-caso.dto'

/**
 * Servicio de gestión de casos de investigación (tabla public.asignacion)
 * Replica la lógica de FRM-ING-C0 y FRM-ING-C1/C2 del sistema legado
 */
@Injectable()
export class CasoService {
  constructor(private readonly repo: CasoRepository) { }

  /**
   * Cálculo del número de caso correlativo por país y gestión:
   * Formato: INV-{idPais}-{N}/{GG}
   * Equivale a la lógica del botón "AsigCaso_Click" del sistema legado
   */
  async calcularSiguienteNumero(
    idPais: number,
    gestion: number
  ): Promise<string> {
    const count = await this.repo.contarCasosPorPaisYGestion(idPais, gestion)
    const siguiente = count + 1
    const gg = String(gestion).slice(2)
    return `INV-${idPais}-${siguiente}/${gg}`
  }

  async crear(dto: CreateCasoDto, usuario: string): Promise<S2iAsignacion> {
    const gestion = new Date(dto.fechaInicio).getFullYear()

    // Calcular nroCasoCer si no se proveyó
    const nroCasoCer =
      dto.nroCasoCer?.trim() ||
      (await this.calcularSiguienteNumero(dto.idPais, gestion))
    // palabraClave vacía queda como string vacío (el sistema legado usaba "")
    const palabraClave = dto.palabraClave?.trim() ?? ''

    const caso = new S2iAsignacion({
      idPais: dto.idPais,
      lugar: dto.lugar.trim() || '*',
      nombreCaso: dto.nombreCaso.trim() || '*',
      palabraClave,
      idEstadoCaso: dto.idEstadoCaso,
      nroCasoCer,
      idEtapaInvestigacion: dto.idEtapaInvestigacion,
      fechaInicio: new Date(dto.fechaInicio),
      antecedentes: dto.antecedentes,
      usuario: usuario.trim(),
    })

    return this.repo.crear(caso)
  }

  async buscarPorId(idCaso: string): Promise<S2iAsignacion> {
    const caso = await this.repo.buscarPorId(idCaso)
    if (!caso) throw new NotFoundException(`Caso ${idCaso} no encontrado`)
    return caso
  }

  async listarPorUsuario(
    numeroPase: string,
    idEtapa?: number
  ): Promise<S2iAsignacion[]> {
    return this.repo.listarPorUsuario(numeroPase, idEtapa)
  }

  /** Trae varios casos por id, sin filtrar por analista (deconfliction entre analistas). */
  async buscarPorIds(idsCaso: string[]): Promise<S2iAsignacion[]> {
    return this.repo.buscarPorIds(idsCaso)
  }

  /** Elimina un caso, solo si pertenece al analista que hace la petición. */
  async eliminar(idCaso: string, numeroPase: string): Promise<void> {
    const caso = await this.repo.buscarPorId(idCaso)
    if (!caso) throw new NotFoundException(`Caso ${idCaso} no encontrado`)
    if (caso.usuario !== numeroPase) {
      throw new ForbiddenException('No tiene permiso para eliminar este caso')
    }
    await this.repo.eliminar(idCaso)
  }
}
