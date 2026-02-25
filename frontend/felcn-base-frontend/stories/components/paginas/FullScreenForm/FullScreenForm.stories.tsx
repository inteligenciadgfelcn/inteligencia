import { Meta, StoryFn } from '@storybook/react'
import { Box } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import FormFullScreen from './FormFullScreen'
import queso from '../../../assets/queso.png'

export default {
  title: 'Páginas/Formularios/Formulario a pantalla completa',
  component: FormFullScreen,
  parameters: {
    docs: {
      description: {
        component: `La plantilla ofrece una estructura estándar para un formulario, integrando componentes de Material-UI y componentes desarrollados dentro del sistema.`,
      },
    },
  },
} as Meta<typeof FormFullScreen>

const Template: StoryFn<typeof FormFullScreen> = (args) => {
  // Paso 1: Crear el tema base con la paleta

  let theme = createTheme({
    palette: {
      primary: {
        main: '#F86F03',
        light: '#FF8A3D',
        dark: '#C65600',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FFA41B',
        light: '#FFB649',
        dark: '#CC8315',
        contrastText: '#000000',
      },
    },
  })

  // Paso 2: Añadir configuraciones específicas de componentes
  theme = createTheme(theme, {
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: '600',
          },
          contained: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
          outlined: {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main + '10',
              borderColor: theme.palette.primary.dark,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: theme.palette.text.primary,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: theme.palette.primary.main,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <FormFullScreen
          imagenProp={args.imagenProp}
          textoNav={args.textoNav}
          textoBar1={args.textoBar1}
          textoBar2={args.textoBar2}
          modulosProp={args.modulosProp}
          mensajeProp={args.mensajeProp}
        />
      </Box>
    </ThemeProvider>
  )
}

export const Ejemplo = Template.bind({})
Ejemplo.storyName = 'Ejemplo 1'
Ejemplo.parameters = {
  docs: {
    description: {
      story: 'Ejemplo del formulario a pantalla completa',
    },
  },
}
Ejemplo.args = {
  imagenProp: queso,
  textoNav: 'Tienda Teoría del Queso',
  textoBar1: 'Armando Paredes',
  textoBar2: 'Jefe de almacén',
  mensajeProp: { id: '/admin/productos', valor: '10' },
  modulosProp: [
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
          label: 'Productos',
          nombre: 'productos',
          propiedades: {
            icono: 'storefront',
            orden: 1,
            descripcion: 'Control de productos del sistema',
          },
          url: '/admin/productos',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Pedidos',
          nombre: 'pedidos',
          propiedades: {
            icono: 'dvr',
            orden: 2,
            descripcion: 'Pedidos',
          },
          url: '/admin/pedidos',
        },
        {
          estado: 'ACTIVO',
          id: '7', // Corregido el ID duplicado
          label: 'Ventas',
          nombre: 'ventas',
          propiedades: {
            icono: 'receipt',
            orden: 2,
            descripcion: 'Ventas realizadas',
          },
          url: '/admin/ventas',
        },
      ],
      url: '/configuraciones',
    },
  ],
}
