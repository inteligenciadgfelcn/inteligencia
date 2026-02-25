import React from 'react'
import { Icono } from '@/components/Icono'
import { useSidebar } from '@/context/SideBarProvider'

export const NavbarMenuButton: React.FC = () => {
  const { sideMenuOpen, closeSideMenu, openSideMenu } = useSidebar()

  const toggleSidebar = () => {
    sideMenuOpen ? closeSideMenu() : openSideMenu()
  }

  return (
    <button
      id="menu-sidebar"
      aria-label="Menu lateral"
      name={sideMenuOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
      onClick={toggleSidebar}
      className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
    >
      <Icono color="action" fontSize="large">{sideMenuOpen ? 'menu_open' : 'menu'}</Icono>
    </button>
  )
}
