import React, { forwardRef, useEffect, useState } from 'react'
import { Input, InputProps } from './Input'
import { formatDecimal, parseDecimal } from '@/utils/formatDecimal'

export interface InputDecimalProps
  extends Omit<InputProps, 'value' | 'onChange' | 'type' | 'uppercase'> {
  /** Valor numérico real. null/undefined representa "sin valor". */
  value: number | null | undefined
  /** Se dispara con el valor numérico ya parseado en cada cambio válido. */
  onValueChange: (value: number | null) => void
  /** Cantidad de decimales mostrados. Por defecto 2. */
  decimals?: number
}

/**
 * Input numérico que muestra el valor en formato boliviano
 * ("," decimal, "." separador de miles) al perder el foco, y permite
 * editar libremente (con "," como decimal) mientras está enfocado.
 */
export const InputDecimal = forwardRef<HTMLInputElement, InputDecimalProps>(
  ({ value, onValueChange, decimals = 2, className = '', ...props }, ref) => {
    const [texto, setTexto] = useState(() => formatDecimal(value, decimals))
    const [enfocado, setEnfocado] = useState(false)

    useEffect(() => {
      if (!enfocado) setTexto(formatDecimal(value, decimals))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, decimals])

    const patronEdicion = new RegExp(`^\\d*(,\\d{0,${decimals}})?$`)

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        className={className}
        value={texto}
        onFocus={(e) => {
          setEnfocado(true)
          setTexto(value !== null && value !== undefined ? String(value).replace('.', ',') : '')
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setEnfocado(false)
          setTexto(formatDecimal(value, decimals))
          props.onBlur?.(e)
        }}
        onChange={(e) => {
          const nuevo = e.target.value
          if (nuevo !== '' && !patronEdicion.test(nuevo)) return
          setTexto(nuevo)
          onValueChange(parseDecimal(nuevo))
        }}
        {...props}
      />
    )
  }
)

InputDecimal.displayName = 'InputDecimal'
