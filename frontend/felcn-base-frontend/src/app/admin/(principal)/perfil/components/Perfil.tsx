'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useAlerts, useConfirmDialog, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { PerfilCard } from './PerfilCard'
import { InformacionCard } from './InformacionCard'
import { CambioPassModal } from './CambioPassModal'
import { EditarPerfilModal } from './EditarPerfilModal'
import { FotoPerfilModal } from './FotoPerfilModal'

export const Perfil = () => {
  const { usuario } = useAuth()
  const { sesionPeticion, cerrarSesion } = useSession()
  const { Alerta } = useAlerts()
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const [modalPass, setModalPass] = useState(false)
  const [modalEdicion, setModalEdicion] = useState(false)
  const [modalFoto, setModalFoto] = useState(false)

  const handleCerrarSesiones = () => {
    confirm({
      titulo: 'Cerrar todas las sesiones',
      texto:
        'Se cerrará su sesión en todos los dispositivos donde tenga la cuenta abierta, incluido este. Deberá iniciar sesión nuevamente. ¿Desea continuar?',
      variante: 'danger',
      textoConfirmar: 'Cerrar todas',
      onConfirm: async () => {
        try {
          const resp = await sesionPeticion({
            url: `${Constantes.authUrl}/usuarios/cuenta/sesiones`,
            method: 'delete',
          })
          Alerta({ mensaje: InterpreteMensajes(resp), variant: 'success' })
        } catch (e) {
          Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
        } finally {
          await cerrarSesion()
        }
      },
    })
  }

  return (
    <div className="pt-5">
      <h2 className="mb-5 text-xl font-semibold">Perfil de Usuario</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PerfilCard
          usuario={usuario}
          onChangePassword={() => setModalPass(true)}
          onEditPhoto={() => setModalFoto(true)}
          onEditarPerfil={() => setModalEdicion(true)}
          onCerrarSesiones={handleCerrarSesiones}
        />

        <div className="lg:col-span-2">
          <InformacionCard usuario={usuario} />
        </div>
      </div>

      <CambioPassModal isOpen={modalPass} onClose={() => setModalPass(false)} />

      <EditarPerfilModal
        isOpen={modalEdicion}
        onClose={() => setModalEdicion(false)}
        usuario={usuario}
      />

      <FotoPerfilModal open={modalFoto} onClose={() => setModalFoto(false)} />

      <ConfirmDialog />
    </div>
  )
}
