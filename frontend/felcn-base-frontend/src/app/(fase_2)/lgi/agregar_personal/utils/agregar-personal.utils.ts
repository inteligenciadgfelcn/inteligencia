import dayjs from 'dayjs'

import type { AgregarPersonalFormValues } from '../types/agregar-personal.types'

export const createDefaultAgregarPersonalValues =
  (): AgregarPersonalFormValues => ({
    nroPaseCredencial: '',
    grado: null,
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    fechaNacimiento: '',
    correoElectronico: '',
    nroTelefonoCelular: '',
    nroTelefonoOficina: '',
    unidad: null,
    distrital: null,
    grupo: null,
    rol: null,
    habilitadoIngreso: '',
    mostrarListaInvestigadores: '',
  })

export const formatNombreCompleto = (
  values: Pick<
    AgregarPersonalFormValues,
    'nombres' | 'apellidoPaterno' | 'apellidoMaterno'
  >
) =>
  `${values.nombres} ${values.apellidoPaterno} ${values.apellidoMaterno}`
    .replace(/\s+/g, ' ')
    .trim()

export const generarCodigoTemporalPersonal = () =>
  `LGI-${dayjs().format('YYYYMMDD-HHmmss')}`
