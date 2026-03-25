import React from 'react'
import { Icono } from '@/components/Icono'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import { titleCase } from '@/utils'
import { RoleType } from '@/app/login/types/loginTypes'
import { useColorScheme } from '@mui/material/styles'
import Image from 'next/image'
import { Constantes } from '@/config/Constantes'

interface UserMenuItemsProps {
  cerrarMenu: () => void
  accionMostrarAlertaCerrarSesion: () => void
}

export const UserMenuItems: React.FC<UserMenuItemsProps> = ({
  cerrarMenu,
  accionMostrarAlertaCerrarSesion,
}) => {
  const { usuario, rolUsuario, setRolUsuario } = useAuth()
  const router = useRouter()
  const { mode, setMode } = useColorScheme()
  const roles = usuario?.roles || []

  const abrirPerfil = () => {
    cerrarMenu()
    router.push('/admin/perfil')
  }

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    if (newMode) {
      setMode(newMode)
    }
  }

  const handleRoleChange = async (newRol: string) => {
    if (newRol) {
      cerrarMenu()
      await setRolUsuario({ idRol: newRol })
    }
  }

  return (
    <div className="w-[320px] max-w-full bg-white dark:bg-[#1b2e4b] text-gray-900 dark:text-white-dark rounded-md shadow-lg overflow-hidden">
      {/* Header Profile */}
      <div className="p-4 flex items-center">
        <div className="shrink-0 mr-3">
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden bg-secondary">
            {usuario?.urlFoto ? (
              <Image
                src={`${Constantes.authUrl}${usuario?.urlFoto}`}
                alt={'Foto de perfil'}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white text-xl font-bold">
                {`${usuario?.persona.nombres[0] ?? ''}${
                  usuario?.persona.primerApellido[0] ??
                  usuario?.persona.segundoApellido[0] ??
                  ''
                }`}
              </div>
            )}
          </div>
        </div>
        <div>
          <h6 className="text-base font-bold">
            {titleCase(usuario?.persona?.nombres ?? '')}{' '}
            {titleCase(
              usuario?.persona?.primerApellido ??
                usuario?.persona?.segundoApellido ??
                ''
            )}
          </h6>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {rolUsuario?.nombre}
          </p>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Menu Options */}
      <div className="py-2">
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
          onClick={abrirPerfil}
        >
          <Icono color={'action'} className="text-gray-500 dark:text-gray-400">
            account_circle
          </Icono>
          <span>Ver perfil</span>
        </button>

        {roles.length > 1 && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-gray-400">
              <Icono className="text-gray-500 dark:text-gray-400">
                switch_account
              </Icono>
              <span>Cambiar rol</span>
            </div>
            <div className="flex flex-wrap gap-1 w-full pl-9">
              {roles.map((rol: RoleType) => (
                <button
                  key={rol.idRol}
                  onClick={() => handleRoleChange(rol.idRol)}
                  className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${rolUsuario?.idRol === rol.idRol ? 'bg-primary text-white border-primary' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {rol.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Theme Section */}
      <div className="p-4">
        <p className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400">
          TEMA
        </p>
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`flex-1 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-primary ${mode === 'light' ? 'text-primary bg-primary/10 z-10' : 'bg-white dark:bg-gray-800'}`}
          >
            <div className="flex items-center justify-center gap-1">
              <Icono fontSize="small">light_mode</Icono>
              <span className="hidden sm:inline">Claro</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-t border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-primary ${mode === 'dark' ? 'text-primary bg-primary/10 z-10' : 'bg-white dark:bg-gray-800'}`}
          >
            <div className="flex items-center justify-center gap-1">
              <Icono fontSize="small">dark_mode</Icono>
              <span className="hidden sm:inline">Oscuro</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`flex-1 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-primary ${mode === 'system' ? 'text-primary bg-primary/10 z-10' : 'bg-white dark:bg-gray-800'}`}
          >
            <div className="flex items-center justify-center gap-1">
              <Icono fontSize="small">settings_brightness</Icono>
              <span className="hidden sm:inline">Sistema</span>
            </div>
          </button>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="py-2">
        <button
          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-3 transition-colors"
          onClick={accionMostrarAlertaCerrarSesion}
        >
          <Icono className="text-red-500">logout</Icono>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
