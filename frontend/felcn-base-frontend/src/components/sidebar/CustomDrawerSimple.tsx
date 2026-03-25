import React, { useState, useCallback } from 'react'
import { Icono } from '@/components/Icono'
import { ModuloType } from '@/app/login/types/loginTypes'
import CustomBadge from '@/components/CustomBadge'
import { versionNumber } from '@/utils'

export type SidebarModuloType = ModuloType & {
  open: boolean
}

export const CustomDrawer: React.FC<{
  variant?: 'permanent' | 'persistent' | 'temporary'
  open?: boolean
  onClose?: () => void
  className?: string
  modulos: Array<SidebarModuloType>
  navigateTo: (url: string) => void
  rutaActual: string
  badgeVariant: string
  checkContentBadge: (id: string) => React.ReactNode
}> = ({
  variant,
  open = true,
  onClose,
  className = '',
  modulos,
  navigateTo,
  rutaActual,
  badgeVariant,
  checkContentBadge,
}) => {
  const [hoveredModulo, setHoveredModulo] = useState<number | null>(null)

  const rutaActiva = useCallback(
    (routeName: string, currentRoute: string) =>
      currentRoute.includes(routeName, 0),
    []
  )

  const handleModuloClick = useCallback(
    (index: number) => {
      modulos[index].open = !modulos[index].open
    },
    [modulos]
  )

  if (!open) return null

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 z-50 ${className}`}
    >
      <div className="h-16 border-b border-gray-200 dark:border-gray-700" />
      <div className="overflow-auto h-[calc(100vh-4rem)] p-2">
        {modulos.map((modulo, index) => (
          <div key={`div-${index}`}>
            <div
              className="flex items-center cursor-pointer m-0 mx-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-3"
              onClick={() => handleModuloClick(index)}
              onMouseEnter={() => setHoveredModulo(index)}
              onMouseLeave={() => setHoveredModulo(null)}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="text-sm text-gray-600 dark:text-gray-400 font-normal"
                  title={modulo.propiedades.descripcion}
                >
                  {modulo.label}
                </span>
                {(hoveredModulo === index || !modulo.open) && (
                  <Icono className="p-0 m-0 mx-3 text-gray-500">
                    {modulo.open ? 'expand_more' : 'navigate_next'}
                  </Icono>
                )}
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${modulo.open ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className="cursor-pointer pt-0 pb-0">
                {modulo.subModulo.map((subModuloItem, indexSubModulo) => (
                  <div
                    id={subModuloItem.url}
                    key={`submodulo-${index}-${indexSubModulo}`}
                    className={`flex items-center justify-between px-2 mx-6 py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      rutaActiva(subModuloItem.url, rutaActual)
                        ? 'bg-primary/10 border-l-4 border-primary text-primary'
                        : ''
                    }`}
                    title={subModuloItem.propiedades.descripcion}
                    onClick={() => navigateTo(subModuloItem.url)}
                  >
                    <div className="flex items-center flex-1">
                      <div className="flex items-center justify-center w-6 h-6 mr-3">
                        <Icono className="text-gray-500 text-sm">
                          {subModuloItem.propiedades.icono}
                        </Icono>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {subModuloItem.label}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <CustomBadge
                        content={checkContentBadge(subModuloItem.url)}
                        variante={badgeVariant}
                        className="text-[10px] px-[6px] py-[11px] rounded-[60px] font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!modulo.open && (
              <div className="border-b border-gray-200 dark:border-gray-700 mx-4" />
            )}
          </div>
        ))}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <p className="text-xs text-gray-500 text-center">
            v{versionNumber()}
          </p>
        </div>
      </div>
    </div>
  )
}
