'use client'

import { useState } from 'react'
import type { SeccionPayloadBase } from '../../../types'

interface SeccionFormProps {
    titulo: string
    onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
    onRecuperar: () => Promise<unknown>
    cargando?: boolean
}

export function Seccion5Form({
    titulo,
    onGuardar,
    onRecuperar,
    cargando = false,
}: SeccionFormProps) {
    const [payload, setPayload] = useState<SeccionPayloadBase>({
        observacion: '',
    })

    return (
        <div className="panel space-y-3">
            <h3 className="text-base font-semibold">{titulo}</h3>
            <textarea
                className="form-textarea w-full"
                rows={4}
                value={String(payload.observacion ?? '')}
                onChange={(e) =>
                    setPayload((prev) => ({ ...prev, observacion: e.target.value }))
                }
                placeholder="Datos de la seccion 5..."
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => void onRecuperar()}
                    disabled={cargando}
                >
                    Recuperar
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => void onGuardar(payload)}
                    disabled={cargando}
                >
                    Guardar Seccion 5
                </button>
            </div>
        </div>
    )
}
