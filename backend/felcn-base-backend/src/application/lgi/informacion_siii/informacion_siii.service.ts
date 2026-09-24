import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DB_SIII } from '@/application/sunesis/shared/constants'
import { AsignacionSiii } from '@/application/sunesis/siii/asignacion/entity/asignacion-siii.entity'
import { ConsultaSiiiQueryDto, RespuestaAvanzadaCompleta } from './dto/consulta_siii.dto'
import { ConsultaSiiiRepository } from './repository/consulta.repository'

@Injectable()
export class InformacionSiiiService {
  constructor(
    @InjectRepository(AsignacionSiii, DB_SIII)
    private readonly asignacionRepository: Repository<AsignacionSiii>,
      private readonly consultaRepository: ConsultaSiiiRepository,
  ) {}

  async obtenerInformacionPorNumeroCaso(numeroCaso: string) {
    const resultados = await this.asignacionRepository.query(
      `
          SELECT
            a.*,
            o.id_operativo AS "idOperativo",
            u.descripcion AS unidad,
            d.descripcion AS distrito,
            g.descripcion AS grupo
          FROM asignacion AS a
          INNER JOIN operativo AS o
            ON o.id_caso = a.id_caso
          INNER JOIN grupo AS g
            ON g.id_grupo = a.id_grupo
          INNER JOIN distrital AS d
            ON d.id_distrital = a.id_distrital
          INNER JOIN unidad AS u
            ON u.id_unidad = d.id_unidad
          WHERE a.numero_caso = $1
          ORDER BY o.id_operativo DESC
        `,
      [numeroCaso]
    )

    if (!resultados.length) {
      throw new NotFoundException(
        `No se encontró información para el caso ${numeroCaso}`
      )
    }

    return resultados
  }

  buscarAvanzado(filtro: ConsultaSiiiQueryDto): Promise<RespuestaAvanzadaCompleta> {
      return this.consultaRepository.buscarAvanzado(filtro)
    }
}
