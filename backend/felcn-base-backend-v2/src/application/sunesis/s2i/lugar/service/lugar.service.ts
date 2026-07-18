import { Injectable } from '@nestjs/common'
import { LugarRepository } from '../repository/lugar.repository'
import { S2iLugar } from '../entity/lugar.entity'
import { CreateLugarDto } from '../dto/create-lugar.dto'

const MIN_CARACTERES_BUSQUEDA = 2

const sinRelleno = (lugar: S2iLugar): S2iLugar => ({
  ...lugar,
  descripcion: lugar.descripcion.trim(),
})

@Injectable()
export class LugarService {
  constructor(private readonly repo: LugarRepository) {}

  async buscar(texto: string): Promise<S2iLugar[]> {
    const q = texto?.trim() ?? ''
    if (q.length < MIN_CARACTERES_BUSQUEDA) return []
    const resultados = await this.repo.buscar(q)
    return resultados.map(sinRelleno)
  }

  /** Evita duplicados: si ya existe un lugar con la misma descripción (sin distinguir mayúsculas), lo reutiliza. */
  async crear(dto: CreateLugarDto): Promise<S2iLugar> {
    const descripcion = dto.descripcion.trim().toUpperCase()
    const existente = await this.repo.buscarExacto(descripcion)
    if (existente) return sinRelleno(existente)

    const creado = await this.repo.crear(new S2iLugar({ descripcion }))
    return sinRelleno(creado)
  }
}
