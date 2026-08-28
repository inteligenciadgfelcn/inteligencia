'use client'

import Image from 'next/image'
import { UsuarioType } from '@/app/login/types/loginTypes'
import { Constantes } from '@/config/Constantes'
import { BASE_PATH } from '@/imageLoader'
import IconLock from '@/components/Icon/IconLock'
import IconCamera from '@/components/Icon/IconCamera'
import IconLogout from '@/components/Icon/IconLogout'
import IconPencil from '@/components/Icon/IconPencil'

interface Props {
  usuario: UsuarioType | null
  onChangePassword: () => void
  onEditPhoto: () => void
  onEditarPerfil: () => void
  onCerrarSesiones: () => void
}

export const PerfilCard = ({
  usuario,
  onChangePassword,
  onEditPhoto,
  onEditarPerfil,
  onCerrarSesiones,
}: Props) => {
  return (
    <div className="panel flex flex-col items-center">
      {/* Avatar — foto propia si la definió, si no el avatar por defecto */}
      <div className="relative mb-4">
        <div className="h-28 w-28 overflow-hidden rounded-full bg-primary/20">
          <Image
            src={
              usuario?.urlFoto
                ? `${Constantes.authUrl}${usuario.urlFoto}`
                : `${BASE_PATH}/assets/images/user-profile.png`
            }
            alt="Perfil"
            fill
            className="object-cover"
          />
        </div>

        <button
          className="absolute bottom-1 right-1 btn btn-primary btn-sm rounded-full"
          onClick={onEditPhoto}
        >
          <IconCamera />
        </button>
      </div>

      {/* Nombre */}
      <h5 className="mb-1 text-lg font-semibold text-center">
        {usuario?.persona.nombres} {usuario?.persona.primerApellido}
      </h5>

      <p className="mb-5 text-white-dark">{usuario?.persona.nombres}</p>

      {/* Botones */}
      <div className="flex w-full flex-col gap-3">
        <button className="btn btn-outline-primary w-full" onClick={onEditarPerfil}>
          <IconPencil className="ltr:mr-2 rtl:ml-2" />
          Editar Perfil
        </button>

        <button className="btn btn-primary w-full" onClick={onChangePassword}>
          <IconLock className="ltr:mr-2 rtl:ml-2" />
          Cambiar Contraseña
        </button>

        <button
          className="btn btn-outline-danger w-full"
          onClick={onCerrarSesiones}
        >
          <IconLogout className="ltr:mr-2 rtl:ml-2" />
          Cerrar todas las sesiones
        </button>
      </div>
    </div>
  )
}
