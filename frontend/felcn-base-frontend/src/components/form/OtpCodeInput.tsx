'use client'

import { ClipboardEvent, KeyboardEvent, useRef } from 'react'

interface OtpCodeInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

/**
 * Entrada de código OTP con una casilla por dígito — estándar de UI para
 * códigos de verificación. Soporta pegar el código completo (desde el
 * portapapeles o el gestor de contraseñas) en cualquiera de las casillas.
 */
export const OtpCodeInput = ({
  length = 6,
  value,
  onChange,
  disabled,
  autoFocus,
}: OtpCodeInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const digitos = Array.from({ length }, (_, i) => value[i] ?? '')

  const actualizarDigito = (indice: number, digito: string) => {
    const nuevo = digitos.slice()
    nuevo[indice] = digito
    onChange(nuevo.join(''))
  }

  const handleChange = (indice: number, texto: string) => {
    const soloDigitos = texto.replace(/\D/g, '')
    if (!soloDigitos) {
      actualizarDigito(indice, '')
      return
    }
    // Si se tipeó/autocompletó más de un caracter de una, se distribuye
    // igual que un paste (algunos gestores de contraseñas autocompletan así).
    if (soloDigitos.length > 1) {
      handlePaste(indice, soloDigitos)
      return
    }
    actualizarDigito(indice, soloDigitos)
    if (indice < length - 1) {
      inputsRef.current[indice + 1]?.focus()
    }
  }

  const handlePaste = (indiceInicial: number, textoPegado: string) => {
    const soloDigitos = textoPegado.replace(/\D/g, '').slice(0, length - indiceInicial)
    if (!soloDigitos) return

    const nuevo = digitos.slice()
    soloDigitos.split('').forEach((d, i) => {
      nuevo[indiceInicial + i] = d
    })
    onChange(nuevo.join(''))

    const siguienteIndice = Math.min(
      indiceInicial + soloDigitos.length,
      length - 1
    )
    inputsRef.current[siguienteIndice]?.focus()
  }

  const handleKeyDown = (indice: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digitos[indice] && indice > 0) {
      inputsRef.current[indice - 1]?.focus()
      actualizarDigito(indice - 1, '')
    } else if (e.key === 'ArrowLeft' && indice > 0) {
      inputsRef.current[indice - 1]?.focus()
    } else if (e.key === 'ArrowRight' && indice < length - 1) {
      inputsRef.current[indice + 1]?.focus()
    }
  }

  const handlePasteEvent = (indice: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    handlePaste(indice, e.clipboardData.getData('text'))
  }

  return (
    <div className="flex justify-center gap-2">
      {digitos.map((digito, indice) => (
        <input
          key={indice}
          ref={(el) => {
            inputsRef.current[indice] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={indice === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digito}
          disabled={disabled}
          autoFocus={autoFocus && indice === 0}
          onChange={(e) => handleChange(indice, e.target.value)}
          onKeyDown={(e) => handleKeyDown(indice, e)}
          onPaste={(e) => handlePasteEvent(indice, e)}
          className="form-input h-14 w-12 text-center text-2xl font-semibold"
        />
      ))}
    </div>
  )
}
