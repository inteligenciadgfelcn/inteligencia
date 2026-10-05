'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Constantes } from '@/config/Constantes'

interface ResultadoDireccion {
  place_id: number | string
  lat: string
  lon: string
  display_name: string
}

interface BuscadorDireccionProps {
  onSeleccionar: (coords: [number, number], etiqueta: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

const MIN_CARACTERES = 3
const LIMITE_RESULTADOS = 5

export function BuscadorDireccion({
  onSeleccionar,
  placeholder = 'Buscar dirección o lugar...',
  autoFocus = false,
  className = '',
}: BuscadorDireccionProps) {
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<ResultadoDireccion[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const buscar = async () => {
    const q = consulta.trim()
    if (q.length < MIN_CARACTERES) {
      setResultados([])
      setError(`Ingrese al menos ${MIN_CARACTERES} caracteres`)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setCargando(true)
    setError(null)

    try {
      const resp = await fetch(
        `${Constantes.apiOpenStreetMap}/search?format=json&limit=${LIMITE_RESULTADOS}&countrycodes=bo&q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      )
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = (await resp.json()) as ResultadoDireccion[]
      const lista = Array.isArray(data) ? data.slice(0, LIMITE_RESULTADOS) : []
      setResultados(lista)
      if (lista.length === 0) {
        setError('Sin resultados para esa búsqueda')
      }
    } catch {
      if (controller.signal.aborted) return
      setResultados([])
      setError('No se pudo buscar. Intente de nuevo.')
    } finally {
      if (!controller.signal.aborted) {
        setCargando(false)
      }
    }
  }

  const seleccionar = (item: ResultadoDireccion) => {
    abortRef.current?.abort()
    setCargando(false)
    const coords: [number, number] = [Number(item.lat), Number(item.lon)]
    setConsulta(item.display_name)
    setResultados([])
    setError(null)
    onSeleccionar(coords, item.display_name)
  }

  return (
    <div className={`relative z-[1000] ${className}`}>
      <div className="flex gap-2">
        <Input
          autoFocus={autoFocus}
          value={consulta}
          placeholder={placeholder}
          aria-label="Buscar dirección"
          onChange={(e) => {
            setConsulta(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void buscar()
            }
          }}
        />
        <Button
          type="button"
          variant="primary"
          loading={cargando}
          onClick={() => void buscar()}
        >
          Buscar
        </Button>
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      {resultados.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-60 overflow-auto rounded-md border border-[#e0e6ed] bg-white shadow-lg dark:border-[#1b2e4b] dark:bg-[#1b2e4b]">
          {resultados.map((item, idx) => (
            <li key={`${item.place_id}-${idx}`}>
              <button
                type="button"
                className="block w-full p-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white-light"
                onClick={() => seleccionar(item)}
              >
                {item.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
