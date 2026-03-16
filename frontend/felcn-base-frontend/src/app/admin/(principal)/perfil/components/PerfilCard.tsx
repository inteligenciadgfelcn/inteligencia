'use client'

import Image from 'next/image'
import { UsuarioType } from '@/app/login/types/loginTypes'
import { Constantes } from '@/config/Constantes'
import IconPencilPaper from '@/components/Icon/IconPencilPaper'
import IconLock from '@/components/Icon/IconLock'
import IconCamera from '@/components/Icon/IconCamera'

interface Props {
  usuario: UsuarioType | null
  onChangePassword: () => void
  onEditProfile: () => void
}

export const PerfilCard = ({
  usuario,
  onChangePassword,
  onEditProfile,
}: Props) => {

  const obtenerIniciales = (nombres: string, apellido: string) =>
    (nombres?.charAt(0) + apellido?.charAt(0)).toUpperCase()

  return (
    <div className="panel flex flex-col items-center">

      {/* Avatar */}
      <div className="relative mb-4">

        <div className="h-28 w-28 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">

          {usuario?.urlFoto ? (
            <Image
              src={`${Constantes.authUrl}${usuario.urlFoto}`}
              alt="Perfil"
              fill
              className="object-cover"
            />
          ) : (
            obtenerIniciales(
              usuario?.persona.nombres || '',
              usuario?.persona.primerApellido || ''
            )
          )}

        </div>

        <button
          className="absolute bottom-1 right-1 btn btn-primary btn-sm rounded-full"
        >
          <IconCamera />
        </button>

      </div>

      {/* Nombre */}
      <h5 className="mb-1 text-lg font-semibold text-center">
        {usuario?.persona.nombres} {usuario?.persona.primerApellido}
      </h5>

      <p className="mb-5 text-white-dark">
        {usuario?.persona.nombres}
      </p>

      {/* Botones */}
      <div className="flex w-full flex-col gap-3">

        <button
          className="btn btn-outline-primary w-full"
          onClick={onEditProfile}
        >
          <IconPencilPaper className="ltr:mr-2 rtl:ml-2" />
          Editar Perfil
        </button>

        <button
          className="btn btn-primary w-full"
          onClick={onChangePassword}
        >
          <IconLock className="ltr:mr-2 rtl:ml-2" />
          Cambiar Contraseña
        </button>

      </div>

    </div>
  )
}
