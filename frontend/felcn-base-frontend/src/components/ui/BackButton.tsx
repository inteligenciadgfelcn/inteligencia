'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import IconArrowBackward from '../Icon/IconArrowBackward'

interface BackButtonProps {
    className?: string
}

/**
 * Botón de retroceso minimalista (sólo icono)
 */
export const BackButton = ({ className = '' }: BackButtonProps) => {
    const router = useRouter()

    return (
        <button
            type="button"
            className={`group flex h-9 w-9 items-center justify-center rounded-full text-primary transition-all duration-300 hover:bg-primary/10 active:scale-90 dark:text-primary-light ${className}`}
            onClick={() => router.back()}
            title="Volver"
        >
            <IconArrowBackward className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
        </button>
    )
}
