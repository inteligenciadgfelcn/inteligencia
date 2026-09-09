import { Injectable, NotFoundException } from '@nestjs/common'
import { LoggerService } from '@/core/logger'
import { VlsVehiculoRepository } from '../../../vls/repository/vehiculo.repository'
import { VlsVehiculo } from '../../../vls/entity/vehiculo.entity'
import { TransporteRepository } from '../repository/transporte.repository'
import { S2iTransporte } from '../entity/transporte.entity'
import { CreateTransporteDto } from '../dto/create-transporte.dto'

/** tipo_transporte siempre debe registrarse con este valor, según regla del flujo. */
const TIPO_TRANSPORTE_VEHICULO = 'VEHICULO'

@Injectable()
export class TransporteService {
  private readonly logger = LoggerService.getInstance()

  constructor(
    private readonly vlsVehiculoRepo: VlsVehiculoRepository,
    private readonly transporteRepo: TransporteRepository
  ) {}

  /**
   * Flujo prompt_vehiculos.txt puntos 2 → 2.1 → 2.1.1:
   * busca el vehículo en felcn_vls y resuelve (busca o crea) el transporte en felcn_s2i.
   * Lanza 404 si el vehículo no existe en felcn_vls (el frontend debe ofrecer el
   * registro manual vía crearDesdeFormulario).
   */
  async buscarOResolver(placa: string): Promise<S2iTransporte> {
    const vehiculo = await this.vlsVehiculoRepo.buscarPorPlaca(placa)
    if (!vehiculo)
      throw new NotFoundException(
        `No se encontró un vehículo con placa ${placa} en felcn_vls`
      )
    return this.resolverTransporteDesdeVehiculo(placa, vehiculo)
  }

  /** Flujo prompt_vehiculos.txt punto 2.2: crea el transporte directamente en felcn_s2i, sin tocar felcn_vls. */
  async crearDesdeFormulario(dto: CreateTransporteDto): Promise<S2iTransporte> {
    const existente = await this.transporteRepo.buscarPorCodigo(
      dto.placa.trim().toUpperCase()
    )
    if (existente) return existente

    const transporte = new S2iTransporte({
      codigoTransporte: dto.placa.trim().toUpperCase(),
      tipo: dto.tipoVehiculo.trim().toUpperCase(),
      marca: dto.marca.trim().toUpperCase(),
      modelo: dto.modelo.trim().toUpperCase(),
      clase: dto.clase.trim().toUpperCase(),
      tipoTransporte: TIPO_TRANSPORTE_VEHICULO,
      color: dto.color.trim().toUpperCase(),
      chasis: dto.chasis.trim().toUpperCase(),
      motor: dto.motor.trim().toUpperCase(),
    })
    return this.transporteRepo.crear(transporte)
  }

  private async resolverTransporteDesdeVehiculo(
    placa: string,
    vehiculo: VlsVehiculo
  ): Promise<S2iTransporte> {
    const codigoTransporte = this.truncar(placa, 10, 'codigo_transporte')
    const existente =
      await this.transporteRepo.buscarPorCodigo(codigoTransporte)
    if (existente) return existente

    const transporte = new S2iTransporte({
      codigoTransporte,
      tipo: this.truncar(vehiculo.tipoVehiculo, 10, 'tipo'),
      marca: this.truncar(vehiculo.marca?.nombre, 50, 'marca'),
      modelo: this.truncar(vehiculo.modelo?.nombre, 4, 'modelo'),
      clase: this.truncar(vehiculo.clase?.nombre, 15, 'clase'),
      tipoTransporte: TIPO_TRANSPORTE_VEHICULO,
      color: this.truncar(vehiculo.color?.nombre, 20, 'color'),
      chasis: this.truncar(vehiculo.chasis, 30, 'chasis'),
      motor: this.truncar(vehiculo.motor, 30, 'motor'),
    })
    return this.transporteRepo.crear(transporte)
  }

  /** Trunca de forma segura un valor que excede el límite de columna, dejando registro en logs. */
  private truncar(
    valor: string | undefined,
    max: number,
    campo: string
  ): string {
    const texto = (valor ?? '').trim().toUpperCase()
    if (texto.length <= max) return texto
    this.logger.warn(
      `transporte.${campo}: valor truncado de ${texto.length} a ${max} caracteres`
    )
    return texto.slice(0, max)
  }
}
