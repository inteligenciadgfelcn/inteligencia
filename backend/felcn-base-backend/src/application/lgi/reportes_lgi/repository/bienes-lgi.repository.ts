import { Injectable } from "@nestjs/common"
import { BienSecuestradoLgiRepository } from "../../bienes_secuestrados/repository/bien_secuestrado_lgi.repository"

@Injectable()
export class BienesLgiReporteRepository {
  constructor(
    private readonly bienesRepository: BienSecuestradoLgiRepository,
  ) {}

  async obtenerBienesPorOperativo(opId: number): Promise<any[]> {
    const listado = await this.bienesRepository.findAllByOperativo(opId)
    const resultado: any[] = []

    // Reutiliza findOne: ya carga fotos activas, características activas
    // y situaciones jurídicas. No modifica el repositorio compartido.
    // Se procesa secuencialmente para no saturar el pool de la BD.
    for (const bien of listado) {
      resultado.push(
        await this.bienesRepository.findOne(Number(bien.itembiensecId)),
      )
    }
    return resultado
  }
}
