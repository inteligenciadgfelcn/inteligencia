'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { PerfilCard } from './PerfilCard'
import { InformacionCard } from './InformacionCard'
import { CambioPassModal } from './CambioPassModal'
import { EditarPerfilModal } from './EditarPerfilModal'

export const Perfil = () => {
  const { usuario } = useAuth()
  const [modalPass, setModalPass] = useState(false)
  const [modalEdicion, setModalEdicion] = useState(false)

  return (
    <div className="pt-5">

      <h2 className="mb-5 text-xl font-semibold">Perfil de Usuario</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <PerfilCard
          usuario={usuario}
          onChangePassword={() => setModalPass(true)}
          onEditProfile={() => setModalEdicion(true)}
        />

        <div className="lg:col-span-2">
          <InformacionCard usuario={usuario} />
        </div>

      </div>

      <CambioPassModal
        isOpen={modalPass}
        onClose={() => setModalPass(false)}
      />

      <EditarPerfilModal
        isOpen={modalEdicion}
        onClose={() => setModalEdicion(false)}
        usuario={usuario}
      />

    </div>
  )
}
