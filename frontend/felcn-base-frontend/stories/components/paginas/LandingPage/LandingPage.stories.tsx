import { Meta, StoryFn } from '@storybook/react'
import { LandingPage } from './page'
import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { NavbarLandingPage } from './NavbarLandingPage'
import { FooterLandingPage } from './FooterLandingPage'
import { landingTheme } from './themes/landingTheme'

export default {
  title: 'Páginas/Landing Page/Landing Page',
  component: LandingPage,
  parameters: {
    docs: {
      description: {
        component: `La plantilla ofrece una estructura estándar compuesta por componentes desarrollados, 
        que incluyen, navbar, footer y una estructura básica para el landing page`,
      },
    },
  },
} as Meta<typeof LandingPage>

const Template: StoryFn<typeof LandingPage> = () => {
  return (
    <ThemeProvider theme={landingTheme}>
      <NavbarLandingPage />
      <Box component="main">
        <LandingPage />
      </Box>
      <FooterLandingPage />
    </ThemeProvider>
  )
}

export const Ejemplo = Template.bind({})
Ejemplo.storyName = 'Ejemplo 1'
Ejemplo.parameters = {
  docs: {
    description: {
      story: 'Ejemplo para el landing page',
    },
  },
}
