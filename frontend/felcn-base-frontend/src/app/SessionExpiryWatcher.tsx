'use client'

import { AlertDialog } from '@/components/modales/AlertDialog'
import { Button } from '@/components/ui/Button'
import { useInactivity } from '@/hooks/useInactivity'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

export default function SessionExpiryWatcher() {
  // Renovación proactiva del token mientras el usuario esté activo
  useTokenRefresh()

  // Cierre de sesión por inactividad
  const { mostrarAviso, continuarSesion, cerrarAhora } = useInactivity()

  return (
    <AlertDialog
      isOpen={mostrarAviso}
      titulo="¿Sigues ahí?"
      texto="Tu sesión se cerrará en 1 minuto por inactividad. ¿Deseas continuar trabajando?"
    >
      <Button
        variant="outline-secondary"
        onClick={() => void cerrarAhora()}
      >
        Cerrar sesión
      </Button>
      <Button
        variant="primary"
        onClick={continuarSesion}
      >
        Continuar
      </Button>
    </AlertDialog>
  )
}
