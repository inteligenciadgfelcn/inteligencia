'use client'

import { useState, useCallback, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertDialog } from '@/components/modales/AlertDialog'

interface ConfirmOptions {
  titulo?: string
  texto: string
  onConfirm: () => Promise<void> | void
  textoConfirmar?: string
  textoCancelar?: string
  variante?: 'danger' | 'warning'
}

interface ConfirmDialogState {
  isOpen: boolean
  titulo: string
  texto: string
  onConfirm: () => Promise<void> | void
  textoConfirmar: string
  textoCancelar: string
  variante: 'danger' | 'warning'
  loading: boolean
}

const ESTADO_INICIAL: ConfirmDialogState = {
  isOpen: false,
  titulo: 'Confirmar',
  texto: '',
  onConfirm: () => {},
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  variante: 'danger',
  loading: false,
}

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState>(ESTADO_INICIAL)

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({
      isOpen: true,
      titulo: options.titulo ?? 'Confirmar',
      texto: options.texto,
      onConfirm: options.onConfirm,
      textoConfirmar: options.textoConfirmar ?? 'Confirmar',
      textoCancelar: options.textoCancelar ?? 'Cancelar',
      variante: options.variante ?? 'danger',
      loading: false,
    })
  }, [])

  const close = useCallback(() => {
    if (state.loading) return
    setState(ESTADO_INICIAL)
  }, [state.loading])

  const handleConfirm = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))
    try {
      await state.onConfirm()
      setState(ESTADO_INICIAL)
    } catch {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [state.onConfirm])

  const ConfirmDialog = useCallback((): ReactNode => {
    if (!state.isOpen) return null

    return (
      <AlertDialog
        isOpen={state.isOpen}
        titulo={state.titulo}
        texto={state.texto}
      >
        <Button
          variant="outline-secondary"
          onClick={close}
          disabled={state.loading}
        >
          {state.textoCancelar}
        </Button>
        <Button
          variant={state.variante}
          onClick={() => void handleConfirm()}
          disabled={state.loading}
        >
          {state.loading ? 'Procesando...' : state.textoConfirmar}
        </Button>
      </AlertDialog>
    )
  }, [state, close, handleConfirm])

  return {
    confirm,
    ConfirmDialog,
    isOpen: state.isOpen,
    close,
  }
}
