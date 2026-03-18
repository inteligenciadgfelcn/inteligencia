import { usePeticion } from '@/hooks'
import { DataTableParams } from '@/services'

export interface PersonaFiliacion {
  id: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoCasada: string
  nacionalidad: string
  sexo: string
  tipoDocumento: string
  numeroDocumento: string
  fechaNacimiento: string
  direccion: string
  estado: string
}

export interface PersonasFiliacionResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: PersonaFiliacion[]
  }
}
const PERSONAS_FILIACION_FAKE: PersonaFiliacion[] = [
  {
    id: 1,
    nombres: 'Juan Carlos',
    apellidoPaterno: 'Mamani',
    apellidoMaterno: 'Quispe',
    apellidoCasada: '',
    nacionalidad: 'Boliviana',
    sexo: 'M',
    tipoDocumento: 'CI',
    numeroDocumento: '6789451',
    fechaNacimiento: '1989-02-12',
    direccion: 'Av. Busch #123',
    estado: 'ACTIVO',
  },
  {
    id: 2,
    nombres: 'Mariana',
    apellidoPaterno: 'Rojas',
    apellidoMaterno: 'Vargas',
    apellidoCasada: 'de Flores',
    nacionalidad: 'Boliviana',
    sexo: 'F',
    tipoDocumento: 'CI',
    numeroDocumento: '4561327',
    fechaNacimiento: '1991-09-03',
    direccion: 'Zona Norte, Calle 4',
    estado: 'ACTIVO',
  },
  {
    id: 3,
    nombres: 'Luis Alberto',
    apellidoPaterno: 'Choque',
    apellidoMaterno: 'Arce',
    apellidoCasada: '',
    nacionalidad: 'Peruana',
    sexo: 'M',
    tipoDocumento: 'PASAPORTE',
    numeroDocumento: 'PA009875',
    fechaNacimiento: '1984-11-21',
    direccion: 'Barrio Central, Pasaje 8',
    estado: 'INACTIVO',
  },
  {
    id: 4,
    nombres: 'Carla Beatriz',
    apellidoPaterno: 'Soria',
    apellidoMaterno: 'Ledezma',
    apellidoCasada: '',
    nacionalidad: 'Boliviana',
    sexo: 'F',
    tipoDocumento: 'CI',
    numeroDocumento: '8122334',
    fechaNacimiento: '1998-06-15',
    direccion: 'Urbanizacion Las Palmas',
    estado: 'ACTIVO',
  },
  {
    id: 5,
    nombres: 'Pedro Miguel',
    apellidoPaterno: 'Nina',
    apellidoMaterno: 'Condori',
    apellidoCasada: '',
    nacionalidad: 'Boliviana',
    sexo: 'M',
    tipoDocumento: 'CI',
    numeroDocumento: '9001452',
    fechaNacimiento: '1979-01-30',
    direccion: 'Calle Comercio s/n',
    estado: 'ACTIVO',
  },
]

const { sesionPeticion } = usePeticion()

export async function getPersonasFiliacionPorCaso(
  params: DataTableParams,
  nroCaso: string | number
): Promise<PersonasFiliacionResponse> {
  //   const endpoint = `/filiacion/personas/${nroCaso}/1`
  //   const textoFiltro = (params.filtro ?? '').trim().toLowerCase()

  //   const filasFiltradas = PERSONAS_FILIACION_FAKE.filter((persona) => {
  //     if (!textoFiltro) return true

  //     return (
  //       persona.nombres.toLowerCase().includes(textoFiltro) ||
  //       persona.apellidoPaterno.toLowerCase().includes(textoFiltro) ||
  //       persona.apellidoMaterno.toLowerCase().includes(textoFiltro) ||
  //       persona.numeroDocumento.toLowerCase().includes(textoFiltro) ||
  //       persona.tipoDocumento.toLowerCase().includes(textoFiltro) ||
  //       persona.estado.toLowerCase().includes(textoFiltro)
  //     )
  //   })

  //   const ordenarPor = params.ordenar as keyof PersonaFiliacion
  //   const filasOrdenadas = [...filasFiltradas].sort((a, b) => {
  //     const valorA = String(a[ordenarPor] ?? '').toLowerCase()
  //     const valorB = String(b[ordenarPor] ?? '').toLowerCase()

  //     if (valorA < valorB) return params.direccion === 'desc' ? 1 : -1
  //     if (valorA > valorB) return params.direccion === 'desc' ? -1 : 1
  //     return 0
  //   })

  //   const inicio = (params.pagina - 1) * params.limite
  //   const fin = inicio + params.limite

  return {
    finalizado: true,
    mensaje: `Datos obtenidos`,
    datos: {
      total: PERSONAS_FILIACION_FAKE.length,
      filas: PERSONAS_FILIACION_FAKE,
    },
  }
}
