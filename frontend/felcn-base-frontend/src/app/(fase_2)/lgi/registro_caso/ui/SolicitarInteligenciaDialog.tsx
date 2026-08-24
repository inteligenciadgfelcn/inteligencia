'use client'

import { CustomDialog } from '@/components/modales/CustomDialog'
import { Button } from '@/components/ui/Button'

interface SolicitarInteligenciaDialogProps {
  open: boolean
  onClose: () => void
}

export function SolicitarInteligenciaDialog({
  open,
  onClose,
}: SolicitarInteligenciaDialogProps) {
  return (
    <CustomDialog
      isOpen={open}
      handleClose={onClose}
      title="Solicitar información"
      maxWidth="sm"
    >
      <div className="space-y-4 p-5">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Solicitar info de inteligencia
        </p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </CustomDialog>
  )
}
