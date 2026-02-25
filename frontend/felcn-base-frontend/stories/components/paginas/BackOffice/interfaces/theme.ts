import { PaletteOptions } from '@mui/material/styles'
import { ColumnaType } from '@/types'
import { MensajeType } from '@/context/SideBarProvider'
import { StaticImageData } from 'next/image'

// Tipo base para estilos de componentes
interface ComponentStyle {
  backgroundColor?: string
  border?: string
  color?: string
}

// Configuración del tema
export interface ThemeVariant {
  palette?: PaletteOptions
  components?: {
    card?: ComponentStyle
    drawer?: {
      paper?: ComponentStyle
      color?: string
    }
    appBar?: ComponentStyle
    icon?: ComponentStyle
    tableHead?: ComponentStyle
    tableBody?: ComponentStyle
  }
}

// Props del componente BackOffice
export interface BackOfficeProps {
  themeVariant?: ThemeVariant
  columnas?: ColumnaType[]
  solicitudesData?: any[] // Considera crear un tipo específico para esto
  titulo?: string
  modulos?: any[] // Considera crear un tipo específico para esto
  mensajeProp?: MensajeType
  imagenProp?: StaticImageData | string
  textoNav?: string
  textoBar1?: string
  textoBar2?: string
  textFooter?: string
  editAccion?: boolean
  showAccion?: boolean
  deleteAccion?: boolean
  headerBackgroundColor?: string
}
