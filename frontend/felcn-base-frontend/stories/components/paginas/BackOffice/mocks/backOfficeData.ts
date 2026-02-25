// mocks/backOfficeData.ts
import { alpha, getContrastRatio } from '@mui/material/styles'
import { ThemeVariant } from '../interfaces/theme'

// Temas
export const cheeseShopTheme: ThemeVariant = {
  palette: {
    primary: {
      main: '#4F200D',
      light: alpha('#4F200D', 0.5),
      dark: alpha('#4F200D', 0.9),
      contrastText:
        getContrastRatio(alpha('#4F200D', 0.7), '#fff') > 4.5 ? '#fff' : '#111',
    },
    secondary: {
      main: '#FFBB64',
    },
    text: {
      primary: '#4F200D',
      disabled: '#fff',
    },
  },
  components: {
    tableHead: {
      backgroundColor: '#FFEAA7',
    },
    card: {
      backgroundColor: '#fafafa',
    },
    drawer: {
      paper: {
        backgroundColor: alpha('#fff', 0.9),
      },
      color: '#4F200D',
    },
    appBar: {
      backgroundColor: alpha('#fff', 0.8),
    },
  },
}

export const healthCenterTheme: ThemeVariant = {
  palette: {
    primary: {
      main: '#006878',
    },
    secondary: {
      main: '#EAE3D2',
      light: alpha('#EAE3D2', 0.5),
      dark: alpha('#EAE3D2', 0.9),
      contrastText:
        getContrastRatio(alpha('#EAE3D2', 0.7), '#fff') > 4.5 ? '#fff' : '#111',
    },
    text: {
      primary: '#4F200D',
      secondary: '#2C3333',
      disabled: '#fff',
    },
  },
  components: {
    drawer: {
      paper: {
        backgroundColor: alpha('#fbfcfd', 0.8),
      },
      color: '#fff',
    },
    appBar: {
      backgroundColor: alpha('#fbfcfd', 0.8),
    },
  },
}

// Interfaces para los datos
interface TableColumn {
  campo: string
  nombre: string
}

interface SubModule {
  estado: 'ACTIVO' | 'INACTIVO'
  id: string
  label: string
  nombre: string
  propiedades: {
    icono?: string
    orden: number
    descripcion: string
  }
  url: string
}

interface Module {
  estado: 'ACTIVO' | 'INACTIVO'
  id: string
  label: string
  nombre: string
  open: boolean
  propiedades: {
    orden: number
    descripcion: string
  }
  showed: boolean
  subModulo: SubModule[]
  url: string
}

// Datos de la tienda de quesos
export const mockCheeseData = {
  columnas: [
    { campo: 'nombre', nombre: 'Nombre del Producto' },
    { campo: 'resumen', nombre: 'Descripción' },
    { campo: 'categoria', nombre: 'Tipo de Queso' },
    { campo: 'fechaPublicacion', nombre: 'Fecha de Ingreso' },
    { campo: 'acciones', nombre: 'Acciones' },
  ] as TableColumn[],
  solicitudesData: [
    {
      id: '1',
      nombre: 'Queso Gouda',
      categoria: 'Roquefort',
      resumen:
        'Queso semiduro de origen holandés con sabor suave y textura cremosa.',
      fechaPublicacion: '2023-05-30',
    },
    {
      id: '2',
      nombre: 'Queso Cheddar',
      categoria: 'Cheddar',
      resumen:
        'Queso británico de sabor fuerte y característico color amarillo.',
      fechaPublicacion: '2023-06-08',
    },
    {
      id: '3',
      nombre: 'Queso Parmesano',
      categoria: 'Parmesano',
      resumen:
        'Queso italiano de sabor intenso y textura granulada, ideal para rallar.',
      fechaPublicacion: '2023-07-29',
    },
    {
      id: '4',
      nombre: 'Queso Brie',
      categoria: 'Parmesano',
      resumen:
        'Queso francés de corteza blanca y suave textura cremosa en el interior.',
      fechaPublicacion: '2023-07-11',
    },
    {
      id: '5',
      nombre: 'Queso Azul',
      categoria: 'Parmesano',
      resumen:
        'Queso de sabor fuerte y característicos mohos azules, originario de Francia.',
      fechaPublicacion: '2023-06-26',
    },
    {
      id: '6',
      nombre: 'Queso Manchego',
      categoria: 'Manchego',
      resumen:
        'Queso español elaborado con leche de oveja de la región de La Mancha.',
      fechaPublicacion: '2023-01-11',
    },
    {
      id: '7',
      nombre: 'Queso Roquefort',
      categoria: 'Roquefort',
      resumen:
        'Queso francés de pasta azul y sabor intenso, elaborado con leche de oveja.',
      fechaPublicacion: '2023-10-25',
    },
    {
      id: '8',
      nombre: 'Queso Feta',
      categoria: 'Feta',
      resumen:
        'Queso griego de sabor salado y textura crujiente, ideal para ensaladas.',
      fechaPublicacion: '2023-04-05',
    },
    {
      id: '9',
      nombre: 'Queso Gruyere',
      categoria: 'Parmesano',
      resumen:
        'Queso suizo de sabor dulce y textura suave, perfecto para fondues.',
      fechaPublicacion: '2023-08-30',
    },
    {
      id: '10',
      nombre: 'Queso Emmental',
      categoria: 'Parmesano',
      resumen:
        'Queso suizo conocido por sus característicos agujeros y sabor suave.',
      fechaPublicacion: '2023-02-02',
    },
    {
      id: '11',
      nombre: 'Queso Camembert',
      categoria: 'Parmesano',
      resumen:
        'Queso francés similar al Brie, pero con un sabor más intenso y terroso.',
      fechaPublicacion: '2023-08-22',
    },
  ],
}

// Datos del centro de salud
export const mockHealthData = {
  columnas: [
    { campo: 'nombre', nombre: 'Nombre del Paciente' },
    { campo: 'resumen', nombre: 'Detalle de la Consulta' },
    { campo: 'categoria', nombre: 'Especialidad Médica' },
    { campo: 'fechaPublicacion', nombre: 'Fecha de Reserva' },
    { campo: 'acciones', nombre: 'Acciones' },
  ] as TableColumn[],
  solicitudesData: [
    {
      id: '1',
      nombre: 'Juan Pérez',
      categoria: 'Cardiología',
      resumen: 'Consulta por dolor en el pecho y dificultad para respirar.',
      fechaPublicacion: '2023-05-30 08:00',
    },
    {
      id: '2',
      nombre: 'María Gómez',
      categoria: 'Dermatología',
      resumen: 'Consulta por erupción cutánea en el rostro.',
      fechaPublicacion: '2023-06-08 10:30',
    },
    {
      id: '3',
      nombre: 'Luis Rodríguez',
      categoria: 'Pediatría',
      resumen: 'Consulta de seguimiento del desarrollo infantil.',
      fechaPublicacion: '2023-07-29 09:15',
    },
    {
      id: '4',
      nombre: 'Ana Martínez',
      categoria: 'Ginecología',
      resumen: 'Consulta por irregularidades menstruales.',
      fechaPublicacion: '2023-07-11 11:45',
    },
    {
      id: '5',
      nombre: 'Carlos Sánchez',
      categoria: 'Oftalmología',
      resumen: 'Consulta por visión borrosa y dolor de cabeza.',
      fechaPublicacion: '2023-06-26 14:00',
    },
  ],
  modulos: [
    {
      estado: 'ACTIVO',
      id: '1',
      label: 'Principal',
      nombre: 'Principal',
      open: true,
      propiedades: { orden: 1, descripcion: 'Sección principal' },
      showed: false,
      subModulo: [
        {
          estado: 'ACTIVO',
          id: '2',
          label: 'Inicio',
          nombre: 'inicio',
          propiedades: {
            icono: 'home',
            orden: 1,
            descripcion: 'Vista de bienvenida con características del sistema',
          },
          url: '/admin/home',
        },
        {
          estado: 'ACTIVO',
          id: '3',
          label: 'Perfil',
          nombre: 'perfil',
          propiedades: {
            icono: 'person',
            orden: 2,
            descripcion: 'Información del perfil de usuario que inicio sesión',
          },
          url: '/admin/perfil',
        },
      ],
      url: '/principal',
    },
    {
      estado: 'ACTIVO',
      id: '4',
      label: 'Opciones',
      nombre: 'opciones',
      open: true,
      propiedades: { orden: 2, descripcion: 'Sección de opciones' },
      showed: false,
      subModulo: [
        {
          estado: 'ACTIVO',
          id: '5',
          label: 'Pacientes',
          nombre: 'pacientes',
          propiedades: {
            icono: 'group',
            orden: 1,
            descripcion: 'Control de pacientes del sistema',
          },
          url: '/admin/pacientes',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Consultas',
          nombre: 'consultas',
          propiedades: {
            icono: 'medical_information',
            orden: 2,
            descripcion: 'Consultas',
          },
          url: '/admin/consultas',
        },
        {
          estado: 'ACTIVO',
          id: '7',
          label: 'Personal médico',
          nombre: 'personal_medico',
          propiedades: {
            icono: 'health_and_safety',
            orden: 3,
            descripcion: 'Personal médico',
          },
          url: '/admin/personal_medico',
        },
      ],
      url: '/configuraciones',
    },
  ] as Module[],
  mensajeProp: { id: '/admin/pacientes', valor: '11' },
}
