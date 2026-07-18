'use client'
import { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { LugarS2iService } from '@/services/analisis'
import type { LugarS2i } from '@/services/analisis'

interface Props {
  valor: LugarS2i | null
  onSeleccionar: (lugar: LugarS2i | null) => void
  error?: boolean
}

export function BuscadorLugar({ valor, onSeleccionar, error = false }: Props) {
  const [texto, setTexto] = useState('')
  const [resultados, setResultados] = useState<LugarS2i[]>([])
  const [buscando, setBuscando] = useState(false)
  const [creando, setCreando] = useState(false)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  const buscar = useDebouncedCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResultados([])
      setBuscando(false)
      return
    }
    setBuscando(true)
    try {
      const r = await LugarS2iService.buscar(q.trim())
      if (r?.finalizado) setResultados(r.datos ?? [])
    } finally {
      setBuscando(false)
    }
  }, 300)

  useEffect(() => {
    const clickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setMostrarDropdown(false)
      }
    }
    document.addEventListener('mousedown', clickFuera)
    return () => document.removeEventListener('mousedown', clickFuera)
  }, [])

  const cambiarTexto = (v: string) => {
    setTexto(v)
    setMostrarDropdown(true)
    buscar(v)
  }

  const seleccionar = (lugar: LugarS2i) => {
    onSeleccionar(lugar)
    setTexto('')
    setResultados([])
    setMostrarDropdown(false)
  }

  const limpiar = () => {
    onSeleccionar(null)
    setTexto('')
    setResultados([])
  }

  const crearNuevo = async () => {
    const descripcion = texto.trim()
    if (!descripcion) return
    setCreando(true)
    try {
      const r = await LugarS2iService.crear({ descripcion })
      if (r?.finalizado) seleccionar(r.datos)
    } finally {
      setCreando(false)
    }
  }

  if (valor) {
    return (
      <div className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${error ? 'border-danger' : 'border-[#e0e6ed] dark:border-[#1b2e4b]'}`}>
        <span className="font-medium">{valor.descripcion}</span>
        <button type="button" className="text-danger hover:text-danger/80" onClick={limpiar}>✕</button>
      </div>
    )
  }

  return (
    <div className="relative" ref={contenedorRef}>
      <Input
        type="text"
        value={texto}
        placeholder="Escriba parte del nombre del lugar..."
        onChange={(e) => cambiarTexto(e.target.value)}
        onFocus={() => setMostrarDropdown(true)}
        className={`w-full ${error ? 'border-danger' : ''}`}
        uppercase
        trimOnBlur
      />
      {mostrarDropdown && texto.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-[#e0e6ed] bg-white shadow-lg dark:border-[#1b2e4b] dark:bg-[#0e1726]">
          {buscando ? (
            <div className="px-3 py-2 text-xs text-gray-500">Buscando...</div>
          ) : resultados.length > 0 ? (
            <ul className="max-h-56 overflow-y-auto py-1">
              {resultados.map((l) => (
                <li key={l.idLugar}>
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => seleccionar(l)}
                  >
                    {l.descripcion}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2">
              <p className="mb-2 px-1 text-xs text-gray-500">Sin coincidencias para &ldquo;{texto.trim()}&rdquo;</p>
              <Button variant="outline-success" size="sm" className="w-full" disabled={creando} onClick={() => void crearNuevo()}>
                + Registrar &ldquo;{texto.trim()}&rdquo; como nuevo lugar
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
