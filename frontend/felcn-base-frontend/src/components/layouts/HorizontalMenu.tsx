'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import IconCaretDown from '@/components/Icon/IconCaretDown'
import { menuIconMap } from '@/components/sidebar/menuIconMap'
import { useState } from 'react'

const AppMenuHorizontal = () => {
  const { rolUsuario } = useAuth()
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string>('')

  const modulos = rolUsuario?.modulos || []
  const modulosConAsignaciones = [
    ...modulos,
    {
      id: 'temporal-operaciones',
      label: 'Operaciones',
      propiedades: {
        icono: 'task',
      },
      subModulo: [
        {
          id: 'temporal-asignaciones',
          label: 'Asignaciones',
          url: '/operaciones/operativo/asignaciones',
          propiedades: {
            icono: 'grid_on',
          },
        },
      ],
    },
  ]

  return (
    <>
      {modulosConAsignaciones.map((modulo: any) => {
        const Icon =
          menuIconMap[modulo.propiedades?.icono] || menuIconMap.default

        return (
          <li key={modulo.id} className="menu nav-item relative">
            {/* BOTON PRINCIPAL */}
            <button
              type="button"
              className={`nav-link ${openMenu === modulo.id ? 'active' : ''}`}
              onClick={() =>
                setOpenMenu(openMenu === modulo.id ? '' : modulo.id)
              }
            >
              <div className="flex items-center">
                <Icon className="shrink-0" />
                <span className="px-1">{modulo.label}</span>
              </div>

              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>

            {/* SUBMENU */}
            <ul
              className={`sub-menu ${
                openMenu === modulo.id ? 'block' : 'hidden'
              }`}
            >
              {modulo.subModulo.map((sub: any) => {
                const SubIcon =
                  menuIconMap[sub.propiedades?.icono] || menuIconMap.default

                return (
                  <li key={sub.id}>
                    <Link
                      href={sub.url}
                      className={pathname === sub.url ? 'active' : ''}
                    >
                      <div className="flex items-center">
                        <SubIcon className="shrink-0" />
                        <span className="ltr:pl-3 rtl:pr-3">{sub.label}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </>
  )
}

export default AppMenuHorizontal
