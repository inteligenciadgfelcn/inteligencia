import { useState, useEffect } from 'react'
import { formatoFecha } from '@/utils/fechas'
import { UsuarioType } from '@/app/login/types/loginTypes'
import { useAuth } from '@/context/AuthProvider'
import { menuIconMap } from '@/components/sidebar/menuIconMap'

// Hook personalizado para detectar mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Equivalente a 'sm' de MUI
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

interface InformacionCardProps {
  usuario: UsuarioType | null
}

interface InfoItem {
  icon: string
  label: string
  value: string | undefined
  tooltip?: string
}

export const InformacionCard = ({ usuario }: InformacionCardProps) => {
  const isMobile = useIsMobile()
  const { setRolUsuario } = useAuth()
  const [loadingRol, setLoadingRol] = useState<string | null>(null)

  /* ---------------- INFO ---------------- */

  const infoItems: InfoItem[] = [
    {
      icon: 'person',
      label: 'Usuario',
      value: usuario?.usuario,
    },
    {
      icon: 'badge',
      label: 'Documento',
      value: `${usuario?.persona.tipoDocumento} ${usuario?.persona.nroDocumento}`,
    },
    {
      icon: 'cake',
      label: 'Nacimiento',
      value: usuario?.persona.fechaNacimiento
        ? formatoFecha(usuario.persona.fechaNacimiento, 'DD/MM/YYYY')
        : 'No disponible',
    },
    {
      icon: 'email',
      label: 'Correo',
      value: usuario?.correoElectronico || 'No disponible',
    },
    {
      icon: 'phone',
      label: 'Teléfono',
      value: usuario?.persona.telefono || 'No disponible',
    },
  ]

  /* ---------------- ROLES ---------------- */

  const handleRolChange = async (idRol: string) => {
    try {
      setLoadingRol(idRol)
      await setRolUsuario({ idRol })
    } finally {
      setLoadingRol(null)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="panel">

      {/* HEADER */}
      <div className="mb-5">
        <h5 className="text-lg font-semibold dark:text-white-light">
          Información del Usuario
        </h5>
        <p className="text-sm text-white-dark">
          Datos personales y accesos asignados
        </p>
      </div>

      {/* DATOS */}
      <div className="space-y-1">
        {infoItems.map((item, index) => {
          const Icon = menuIconMap[item.icon] || menuIconMap.default

          return (
            <div
              key={index}
              className="flex items-center p-3 rounded-md transition hover:bg-gray-100 dark:hover:bg-[#1b2e4b]"
            >
              <div className="mr-4">
                <div className="grid h-9 w-9 place-content-center rounded-md bg-primary-light text-primary dark:bg-primary dark:text-primary-light">
                  <Icon />
                </div>
              </div>

              <div className="flex-1">
                <div className="text-xs text-white-dark">
                  {item.label}
                </div>
                <div className="text-sm font-medium">
                  {item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* ROLES */}
      <div className="mb-4">
        <h6 className="text-sm font-semibold dark:text-white-light">
          Roles asignados
        </h6>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {usuario?.roles.map((role, index) => {
          const isActive = role.idRol === usuario.idRol;
          const isLoading = loadingRol === role.idRol;
          
          return (
            <span
              key={index}
              onClick={() => handleRolChange(role.idRol)}
              className={`
                px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-white' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                ${!!loadingRol ? 'pointer-events-none' : ''}
              `}
            >
              {role.nombre}
            </span>
          )
        })}
      </div>

      {/* MODULOS */}
      {!isMobile && usuario?.roles[0]?.modulos && (
        <>
          <hr className="mb-6 border-gray-200 dark:border-gray-700" />

          <div className="mb-4">
            <h6 className="text-sm font-semibold dark:text-white-light">
              Módulos accesibles
            </h6>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {usuario.roles[0].modulos.map((modulo, index) => {
              const Icon = menuIconMap[modulo.icon] || menuIconMap.default

              return (
                <div key={index}>
                  <div className="panel hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-content-center rounded-md bg-info-light text-info dark:bg-info dark:text-info-light">
                        <Icon />
                      </div>

                      <div>
                        <p className="font-medium">{modulo.label}</p>
                        <p className="text-xs text-white-dark">
                          {modulo.subModulo.length} submódulo
                          {modulo.subModulo.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

    </div>
  )
}
