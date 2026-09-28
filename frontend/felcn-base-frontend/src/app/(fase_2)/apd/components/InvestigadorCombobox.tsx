'use client'

import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/Input'

import { InvestigadoresApi } from '../registro_caso/api/investigadores.api'
import type { InvestigadorGeneralRow } from '../registro_caso/types/investigadores.types'

type Props = {
  id?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  showSelected?: boolean
  error?: string
  onSelect?: (inv: InvestigadorGeneralRow) => void
  onInputChange?: (value: string) => void
}

export function InvestigadorCombobox({
  id,
  value = '',
  placeholder = 'Escriba el nro de pase para buscar...',
  disabled,
  showSelected = false,
  error,
  onSelect,
  onInputChange,
}: Props) {
  const [resultados, setResultados] = useState<InvestigadorGeneralRow[]>([])
  const [buscando, setBuscando] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [seleccionado, setSeleccionado] = useState<InvestigadorGeneralRow | null>(
    null
  )

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleInputChange = (valor: string) => {
    onInputChange?.(valor)
    setSeleccionado(null)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (valor.length >= 3) {
      setBuscando(true)
      debounceRef.current = setTimeout(async () => {
        try {
          const respuesta = await InvestigadoresApi.buscarGenerales({
            pagina: 1,
            limite: 10,
            filtro: valor,
          })
          setResultados(respuesta.datos?.filas ?? [])
          setDropdownOpen(true)
        } catch {
          setResultados([])
          setDropdownOpen(false)
        } finally {
          setBuscando(false)
        }
      }, 300)
    } else {
      setResultados([])
      setDropdownOpen(false)
      setBuscando(false)
    }
  }

  const handleSelect = (inv: InvestigadorGeneralRow) => {
    setSeleccionado(inv)
    setDropdownOpen(false)
    setResultados([])
    onSelect?.(inv)
  }

  const labelCompleto = (inv: InvestigadorGeneralRow) =>
    `${inv.investigador} - ${inv.numeroPase.trim()}`

  return (
    <div>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          className="w-full"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          error={!!error}
        />
        {buscando && !disabled && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {dropdownOpen && resultados.length > 0 && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 max-h-60 overflow-auto shadow-lg"
        >
          {resultados.map((inv, i) => (
            <button
              key={i}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              onClick={() => handleSelect(inv)}
            >
              {labelCompleto(inv)}
            </button>
          ))}
        </div>
      )}

      {showSelected && seleccionado && !disabled && (
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
          Seleccionado: {labelCompleto(seleccionado)}
        </p>
      )}

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}