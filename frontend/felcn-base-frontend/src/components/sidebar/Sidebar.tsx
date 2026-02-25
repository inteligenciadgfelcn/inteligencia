'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSidebar } from '@/context/SideBarProvider'
import { useAuth } from '@/context/AuthProvider'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import {
  CustomDrawer,
  SidebarModuloType,
} from '@/components/sidebar/CustomDrawerSimple'

const drawerWidth = 220

export const Sidebar: React.FC = () => {
  const { sideMenuOpen, closeSideMenu, openSideMenu, checkContentBadge } =
    useSidebar()
  const { usuario, rolUsuario, estaAutenticado, progresoLogin } = useAuth()

  const [modulos, setModulos] = useState<SidebarModuloType[]>([])

  const router = useRouter()
  const { isMobile, isTablet, isSmallScreen } = useIsMobile()

  const { estadoFullScreen } = useFullScreenLoading()

  const pathname = usePathname()

  const interpretarModulos = useCallback(() => {
    imprimir(`Cambio en módulos`)
    const rolSeleccionado = usuario?.roles.find(
      (itemRol) => itemRol.idRol === rolUsuario?.idRol
    )
    imprimir(`rolSeleccionado`, rolSeleccionado)
    setModulos(
      rolSeleccionado?.modulos.map((modulo) => ({ ...modulo, open: true })) ??
        []
    )
  }, [usuario, rolUsuario])

  const navigateTo = useCallback(
    (url: string) => {
      if (isSmallScreen) {
        closeSideMenu()
      }
      router.push(url)
    },
    [isSmallScreen, closeSideMenu, router]
  )

  useEffect(() => {
    if (isSmallScreen) {
      closeSideMenu()
    } else {
      openSideMenu()
    }
  }, [isSmallScreen, closeSideMenu, openSideMenu])

  useEffect(() => {
    interpretarModulos()
  }, [interpretarModulos])

  return (
    <CustomDrawer
      variant={isSmallScreen ? 'temporary' : 'persistent'}
      open={
        sideMenuOpen &&
        estaAutenticado &&
        modulos.length > 0 &&
        !progresoLogin &&
        !estadoFullScreen
      }
      onClose={closeSideMenu}
      className={`${sideMenuOpen ? `w-[${drawerWidth}px]` : 'w-0'} flex-shrink-0 transition-all duration-200 ease-out`}
      rutaActual={pathname}
      modulos={modulos}
      navigateTo={navigateTo}
      badgeVariant="primary"
      checkContentBadge={checkContentBadge}
    />
  )
}
