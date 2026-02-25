import { Meta, StoryFn } from '@storybook/react'
import { Dashboard } from './Dashboard'

export default {
  title: 'Plantillas/Dashboard/Dashboard',
  component: Dashboard,
  parameters: {
    docs: {
      description: {
        component:
          'El Storyboard presenta un Dashboard de Ventas que emplea `@mui/x-charts` para gráficos de barras y de pie, junto con componentes de `Material-UI` para una interfaz de usuario moderna. Los gráficos de barras muestran la evolución de las ventas a lo largo del tiempo, mientras que los de pie analizan las ventas por área.',
      },
    },
  },
} as Meta<typeof Dashboard>

// replica del componente
export const Template: StoryFn<typeof Dashboard> = () => {
  return <Dashboard />
}
