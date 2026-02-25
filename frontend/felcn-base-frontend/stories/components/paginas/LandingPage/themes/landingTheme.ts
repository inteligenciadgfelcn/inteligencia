// themes/landingTheme.ts
import { createTheme } from '@mui/material/styles'

// Primer paso: crear el tema base con los colores
let landingTheme = createTheme({
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

// Segundo paso: extender el tema con personalizaciones de componentes
landingTheme = createTheme(landingTheme, {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '600',
        },
        contained: {
          backgroundColor: landingTheme.palette.primary.main,
          color: landingTheme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: landingTheme.palette.primary.dark,
          },
        },
        outlined: {
          borderColor: landingTheme.palette.primary.main,
          color: landingTheme.palette.primary.main,
          '&:hover': {
            backgroundColor: landingTheme.palette.primary.main + '10',
            borderColor: landingTheme.palette.primary.dark,
          },
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

export { landingTheme }
