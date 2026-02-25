import { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import BackOfficeStory from './BackOfficeSample'
import { createCustomTheme } from './utils/themeUtils'
import { BackOfficeProps } from './interfaces/theme'
import {
  cheeseShopTheme,
  healthCenterTheme,
  mockCheeseData,
  mockHealthData,
} from './mocks/backOfficeData'
import hospital from '../../../assets/hospital.png'
import queso from '../../../assets/queso.png'

export default {
  title: 'Páginas/BackOffice/Back Office',
  component: BackOfficeStory,
  parameters: {
    docs: {
      description: {
        component:
          'La plantilla `Back Office` ofrece una estructura estándar compuesta por componentes desarrollados.',
      },
    },
  },
  argTypes: {
    themeVariant: { control: 'object' },
  },
} as Meta<typeof BackOfficeStory>

const Template: StoryFn<BackOfficeProps> = (args: BackOfficeProps) => {
  const baseTheme = useTheme()
  const theme = createCustomTheme(baseTheme, args.themeVariant)

  return (
    <ThemeProvider theme={theme}>
      <BackOfficeStory {...args} />
    </ThemeProvider>
  )
}

export const CheeseShop = Template.bind({})
CheeseShop.storyName = 'Ejemplo - Tienda de quesos'
CheeseShop.args = {
  themeVariant: cheeseShopTheme,
  ...mockCheeseData,
  titulo: 'Inventario de quesos',
  textoNav: 'Teoría del Queso',
  imagenProp: queso,
  textoBar1: 'Esteban Quito',
  textoBar2: 'Vendedor',
  textFooter: 'Teoría del Queso',
  editAccion: false,
  deleteAccion: false,
  headerBackgroundColor: '#FFEAA7',
}

export const HealthCenter = Template.bind({})
HealthCenter.storyName = 'Ejemplo - Centro de salud'
HealthCenter.args = {
  themeVariant: healthCenterTheme,
  ...mockHealthData,
  titulo: 'Fichas de Pacientes',
  textoNav: 'Centro de Salud',
  imagenProp: hospital,
  textoBar1: 'Armando Lios',
  textoBar2: 'Recepcionista',
  textFooter: 'Centro de Salud',
  headerBackgroundColor: 'background.paper',
}
