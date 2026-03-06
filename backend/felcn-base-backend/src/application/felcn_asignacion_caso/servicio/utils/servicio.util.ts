import { Estado } from "@/application/felcn_siii/estado.enum"
import { BadRequestException } from "@nestjs/common"
import { Repository } from "typeorm"
import { Servicio } from "../entities/servicio.entity"
import { formatearFecha } from "./fecha.util"


export function generarCodigoServicio(
  fechaIngreso: Date,
  fechaSalida: Date,
  ahora: Date
) {
  return (
    `ICIA-${fechaIngreso.getDate().toString().padStart(2, '0')}` +
    `${fechaSalida.getDate().toString().padStart(2, '0')}` +
    `${(ahora.getMonth() + 1).toString().padStart(2, '0')}` +
    `${ahora.getFullYear()}`
  )
}


export async function cerrarServiciosVencidos(
  servicioRepository: Repository<Servicio>,
  ahora: Date
) {
  await servicioRepository
    .createQueryBuilder()
    .update()
    .set({ estado: Estado.INACTIVO })
    .where('fechaSalida < :ahora', { ahora })
    .andWhere('estado = :estado', { estado: Estado.ACTIVO })
    .execute()
}


export async function validarCruceServicios(
  servicioRepository: Repository<Servicio>,
  fechaIngreso: Date,
  fechaSalida: Date,
  codigoExcluir?: string
) {
  const query = servicioRepository
    .createQueryBuilder('s')
    .where('s.estado = :estado', { estado: Estado.ACTIVO })
    .andWhere('s.fechaIngreso <= :fechaSalida', { fechaSalida })
    .andWhere('s.fechaSalida >= :fechaIngreso', { fechaIngreso })

  if (codigoExcluir) {
    query.andWhere('s.codigoServicio != :codigoExcluir', { codigoExcluir })
  }

  const existe = await query.getOne()

  if (existe) {
    throw new BadRequestException(
      `Ya existe un servicio desde ${formatearFecha(
        existe.fechaIngreso
      )} hasta ${formatearFecha(existe.fechaSalida)}`
    )
  }
}


export async function buscarServicioHoy(
  servicioRepository: Repository<Servicio>
) {
  const inicioDia = new Date()
  inicioDia.setHours(0, 0, 0, 0)

  const finDia = new Date()
  finDia.setHours(23, 59, 59, 999)

  return await servicioRepository
    .createQueryBuilder('s')
    .where('s.fechaIngreso BETWEEN :inicioDia AND :finDia', {
      inicioDia,
      finDia,
    })
    .andWhere('s.estado = :estado', { estado: Estado.ACTIVO })
    .getOne()
}