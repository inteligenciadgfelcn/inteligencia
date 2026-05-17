'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'
import IconCaretDown from '@/components/Icon/IconCaretDown'
import { menuIconMap } from '@/components/sidebar/menuIconMap'

interface Props {
  orientation?: 'vertical' | 'horizontal'
}

export const AppMenu = ({ orientation = 'vertical' }: Props) => {
  const { rolUsuario } = useAuth()

  if (!rolUsuario?.modulos) return null

  const modulosConAsignaciones = [
    ...rolUsuario.modulos,
    {
      id: 'temporal-operaciones',
      label: 'Operaciones',
      icon: 'task',
      subModulo: [
        {
          id: 'temporal-asignaciones',
          label: 'Asignaciones',
          url: '/operativos/asignaciones',
        },
      ],
    },
  ]

  return (
    <>
      {modulosConAsignaciones.map((modulo: any) => {
        const Icon = menuIconMap[modulo.icon] || menuIconMap.default

        return (
          <li
            key={modulo.id}
            className={`menu nav-item relative ${
              orientation === 'horizontal' ? 'px-1' : ''
            }`}
          >
            {/* MODULO */}
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <Icon className="shrink-0" />
                <span className="px-1">{modulo.label}</span>
              </div>

              {modulo.subModulo?.length > 0 && (
                <div className="right_arrow">
                  <IconCaretDown />
                </div>
              )}
            </button>

            {/* SUBMODULOS */}
            {modulo.subModulo?.length > 0 && (
              <ul className="sub-menu">
                {modulo.subModulo.map((sub: any) => (
                  <li key={sub.id}>
                    <Link href={sub.url}>{sub.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </>
  )
}
