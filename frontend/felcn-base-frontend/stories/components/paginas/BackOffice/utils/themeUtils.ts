// utils/themeUtils.ts
import { createTheme, Theme } from '@mui/material/styles'
import { ThemeVariant } from '../interfaces/theme'

export const createCustomTheme = (
  baseTheme: Theme,
  variant?: ThemeVariant
): Theme => {
  if (!variant) return baseTheme

  // Paso 1: Crear el tema base con las opciones de paleta
  let theme = createTheme({
    palette: variant.palette || {},
  })

  // Paso 2: Componer el tema con los componentes
  if (variant.components) {
    theme = createTheme(theme, {
      components: {
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              color: theme.palette.text.primary,
              '&.Mui-selected': {
                textTransform: 'none',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
              },
            },
            indicator: {
              backgroundColor: theme.palette.primary.main,
              height: 3,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              textTransform: 'none',
            },
            indicator: {
              backgroundColor: theme.palette.primary.main,
              height: 3,
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
        MuiIcon: {
          styleOverrides: {
            root: {
              color: theme.palette.primary.main,
            },
          },
        },
        // Componentes de Card
        ...(variant.components.card && {
          MuiCard: {
            styleOverrides: {
              root: {
                border: variant.components.card.border,
                boxShadow: 'none',
                backgroundColor: variant.components.card.backgroundColor,
              },
            },
          },
        }),
        // Componentes de Drawer
        ...(variant.components.drawer && {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor:
                  variant.components.drawer.paper?.backgroundColor,
                color: variant.components.drawer.color,
              },
            },
          },
        }),
        // Componentes de AppBar
        ...(variant.components.appBar && {
          MuiAppBar: {
            defaultProps: {
              elevation: 0,
              variant: 'outlined',
            },
            styleOverrides: {
              colorPrimary: {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                backgroundColor: variant.components.appBar.backgroundColor,
                backdropFilter: 'blur(12px)',
              },
            },
          },
        }),
        // Componentes de TableHead
        ...(variant.components.tableHead && {
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: variant.components.tableHead.backgroundColor,
              },
            },
          },
        }),
        // Componentes de TableBody
        ...(variant.components.tableBody && {
          MuiTableBody: {
            styleOverrides: {
              root: {
                backgroundColor: variant.components.tableBody.backgroundColor,
              },
            },
          },
        }),
      },
    })
  }

  return theme
}
