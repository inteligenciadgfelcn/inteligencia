import { CasoActualizacionTable } from '../types/caso.actualizacion.table'

const fakeData: CasoActualizacionTable[] = [
  {
    id: 1,
    codigoRegistro: 'ICIA-0001-2026',
    departamento: 'La Paz',
    unidad: 'FELCN Central',
    nroCaso: 'CASO-1001',
    nroRegistro: 'REG-2026-001',
    fechaHoraOperativo: '2026-03-10 08:30',
    nombreCaso: 'Operativo Altiplano',
    asignadoCaso: 'Tte. Juan Perez',
    fiscalAsignado: 'Dra. Maria Flores',
    codigoDepartamento: 'LP',
  },
  {
    id: 2,
    codigoRegistro: 'ICIA-0002-2026',
    departamento: 'Cochabamba',
    unidad: 'FELCN Sur',
    nroCaso: undefined,
    nroRegistro: 'REG-2026-002',
    fechaHoraOperativo: '2026-03-09 15:20',
    nombreCaso: 'Operativo Valle',
    asignadoCaso: 'Cap. Ana Rojas',
    fiscalAsignado: 'Dr. Carlos Mendez',
    codigoDepartamento: 'CB',
  },
]

export const getActualizacionData = async (): Promise<
  CasoActualizacionTable[]
> => {
  // Simulación de retraso en la respuesta
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return fakeData
}
