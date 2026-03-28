'use client'
import React, {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { imprimir } from '@/utils/imprimir'

export interface MensajeType {
  id: string
  valor: ReactNode
}

interface UIContextType {
  sideMenuOpen: boolean
  closeSideMenu: () => void
  openSideMenu: () => void
  addContentBadge: (id: string, valor: ReactNode) => void
  checkContentBadge: (id: string) => ReactNode
}

const UIContext = createContext<UIContextType>({} as UIContextType)
const useSidebar = () => useContext(UIContext)

const SideBarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(true)
  const [mensajes, setMensajes] = useState<MensajeType[]>([])

  const openSideMenu = useCallback(() => {
    imprimir(`openSideMenu`)
    setSideMenuOpen(true)
  }, [])

  const closeSideMenu = useCallback(() => {
    imprimir(`closeSideMenu`)
    setSideMenuOpen(false)
  }, [])

  const addContentBadge = useCallback(
    (id: string, valor: ReactNode) => {
      const mensajeExistente = mensajes.find((mensaje) => mensaje.id === id)
      const mensajesActualizados = mensajeExistente
        ? mensajes.map((mensaje) =>
            mensaje.id === id ? { ...mensaje, valor } : mensaje
          )
        : [...mensajes, { id, valor }]
      setMensajes(mensajesActualizados)
    },
    [mensajes]
  )

  const checkContentBadge = useCallback(
    (id: string) => mensajes.find((mensaje) => mensaje.id === id)?.valor,
    [mensajes]
  )

  return (
    <UIContext.Provider
      value={{
        sideMenuOpen,

        // Métodos
        closeSideMenu,
        openSideMenu,
        addContentBadge,
        checkContentBadge,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export { useSidebar, SideBarProvider }
