import { Injectable, NotFoundException } from '@nestjs/common'
import { LoggerService } from '@/core/logger'
import { PersonaRepository } from '../../../personas/repository/persona.repository'
import { PersonasPersona } from '../../../personas/entity/persona.entity'
import { ConductorRepository } from '../repository/conductor.repository'
import { S2iConductor } from '../entity/conductor.entity'
import { CreateConductorDto } from '../dto/create-conductor.dto'

/** idPais de conductor siempre debe asignarse con este valor (Bolivia), según regla del flujo. */
const ID_PAIS_CONDUCTOR = 70

@Injectable()
export class ConductorService {
  private readonly logger = LoggerService.getInstance()

  constructor(
    private readonly personaRepo: PersonaRepository,
    private readonly conductorRepo: ConductorRepository
  ) {}

  /**
   * Flujo prompt_personas.txt puntos 2 → 2.1 → 2.1.1:
   * busca persona en felcn_personas y resuelve (busca o crea) el conductor en felcn_s2i.
   * Lanza 404 si la persona no existe en felcn_personas (el frontend debe ofrecer el
   * registro manual vía crearDesdeFormulario).
   */
  async buscarOResolver(documento: string): Promise<S2iConductor> {
    const persona = await this.personaRepo.buscarPorDocumento(documento)
    if (!persona)
      throw new NotFoundException(
        `No se encontró una persona con documento ${documento} en felcn_personas`
      )
    return this.resolverConductorDesdePersona(persona)
  }

  /** Flujo prompt_personas.txt punto 2.2: crea la persona y luego resuelve el conductor. */
  async crearDesdeFormulario(dto: CreateConductorDto): Promise<S2iConductor> {
    const persona = await this.personaRepo.crear(
      new PersonasPersona({
        documento: dto.documento.trim(),
        nombres: dto.nombres.trim().toUpperCase(),
        paterno: dto.paterno.trim().toUpperCase(),
        materno: dto.materno.trim().toUpperCase(),
        esposo: dto.esposo?.trim().toUpperCase() ?? '',
        sexo: dto.sexo.trim().toUpperCase(),
        ocupacion: dto.ocupacion.trim().toUpperCase(),
        dir1: dto.dir1.trim().toUpperCase(),
        dir2: dto.dir2?.trim().toUpperCase() ?? '',
        nomdep: dto.nomdep.trim().toUpperCase(),
        nomprov: dto.nomprov.trim().toUpperCase(),
        nommun: dto.nommun.trim().toUpperCase(),
        fechanac: new Date(dto.fechanac),
      })
    )
    return this.resolverConductorDesdePersona(persona)
  }

  private async resolverConductorDesdePersona(
    persona: PersonasPersona
  ): Promise<S2iConductor> {
    const existente = await this.conductorRepo.buscarPorDocumento(
      persona.documento
    )
    if (existente) return existente

    const conductor = new S2iConductor({
      numeroDocumento: this.truncar(persona.documento, 10, 'numero_documento'),
      nombres: this.truncar(persona.nombres, 75, 'nombres'),
      paterno: this.truncar(persona.paterno, 50, 'paterno'),
      materno: this.truncar(persona.materno, 50, 'materno'),
      esposo: this.truncar(persona.esposo, 50, 'esposo'),
      idPais: ID_PAIS_CONDUCTOR,
      sexo: this.truncar(persona.sexo, 1, 'sexo'),
      ocupacion: this.truncar(persona.ocupacion, 50, 'ocupacion'),
      direccion: this.truncar(persona.dir1, 150, 'direccion'),
    })
    return this.conductorRepo.crear(conductor)
  }

  /** Trunca de forma segura un valor que excede el límite de columna, dejando registro en logs. */
  private truncar(valor: string, max: number, campo: string): string {
    const texto = (valor ?? '').trim()
    if (texto.length <= max) return texto
    this.logger.warn(
      `conductor.${campo}: valor truncado de ${texto.length} a ${max} caracteres`
    )
    return texto.slice(0, max)
  }
}
