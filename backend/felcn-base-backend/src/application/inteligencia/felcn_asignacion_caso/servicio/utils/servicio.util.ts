
import { Repository } from "typeorm"
import { Servicio } from "../entities/servicio.entity"
import { Estado } from "@/application/inteligencia/felcn_siii/estado.enum"


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
const resultado=   await servicioRepository
    .createQueryBuilder()
    .update()
    .set({ estado: Estado.INACTIVO })
    .where('fechaSalida < :ahora', { ahora })
    .andWhere('estado = :estado', { estado: Estado.ACTIVO })
    .execute()

    console.log('Servicios cerrados:', resultado.affected)
console.log('Registros:', resultado.raw)
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

}


export async function buscarServicioPorFecha(
  servicioRepository: Repository<Servicio>,
  fecha: Date
) {
  const inicioDia = new Date(fecha)
  inicioDia.setHours(0, 0, 0, 0)

  const finDia = new Date(fecha)
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