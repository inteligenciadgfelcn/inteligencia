'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useAlerts } from '@/hooks/useAlerts'
import { Icono } from '@/components/Icono'
import { InterpreteMensajes } from '@/utils'

import {
  BusquedaGeneralApdApi,
  LIMITE_POR_PAGINA,
} from '../api/busqueda-general-apd.api'
import type {
  CatalogosApd,
  FilaCasoApd,
  FiltrosBusquedaApd,
  FormatoExportacion,
} from '../types/busqueda-general-apd.types'

import { FiltrosBusquedaGeneralApd } from './FiltrosBusquedaGeneralApd'
import { PanelDetalleCasoApd } from './PanelDetalleCasoApd'
import { TablaCasosApd } from './TablaCasosApd'

const DEBOUNCE_BUSQUEDA_MS = 400

const descargar = (blob: Blob, nombreArchivo: string) => {
  const objectUrl = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = objectUrl
  enlace.download = nombreArchivo
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(objectUrl)
}

export function BusquedaGeneralPageApd() {
  const { Alerta } = useAlerts()

  const [catalogos, setCatalogos] = useState<CatalogosApd | null>(null)
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true)

  const [filtros, setFiltros] = useState<FiltrosBusquedaApd | null>(null)
  const [rows, setRows] = useState<FilaCasoApd[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMITE_POR_PAGINA)
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [exportando, setExportando] = useState<FormatoExportacion | null>(null)

  const [busquedaInput, setBusquedaInput] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [casoDetalle, setCasoDetalle] = useState<FilaCasoApd | null>(null)

  /* ── Catálogos: se cargan una vez por montaje de la pantalla ── */

  useEffect(() => {
    let activo = true

    BusquedaGeneralApdApi.obtenerCatalogos()
      .then((data) => {
        if (activo) setCatalogos(data)
      })
      .catch((e) => {
        if (!activo) return
        Alerta({
          mensaje:
            InterpreteMensajes(e) || 'No se pudieron cargar los catálogos.',
          variant: 'error',
        })
      })
      .finally(() => {
        if (activo) setCargandoCatalogos(false)
      })

    return () => {
      activo = false
    }
  }, [Alerta])

  /* ── Debounce del buscador de la tabla ── */

  const timerBusqueda = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onBusquedaChange = useCallback((valor: string) => {
    setBusquedaInput(valor)
    if (timerBusqueda.current) clearTimeout(timerBusqueda.current)
    timerBusqueda.current = setTimeout(() => {
      setBusqueda(valor.trim())
      setPage(1)
    }, DEBOUNCE_BUSQUEDA_MS)
  }, [])

  useEffect(
    () => () => {
      if (timerBusqueda.current) clearTimeout(timerBusqueda.current)
    },
    []
  )

  /* ── Búsqueda paginada ── */

  useEffect(() => {
    if (!filtros) return

    let activo = true
    setCargando(true)

    BusquedaGeneralApdApi.buscar(filtros, {
      pagina: page,
      limite: limit,
      filtro: busqueda || undefined,
    })
      .then((data) => {
        if (!activo) return
        setRows(data.filas)
        setTotal(data.total)
      })
      .catch((e) => {
        if (!activo) return
        Alerta({
          mensaje: InterpreteMensajes(e) || 'Error al realizar la búsqueda.',
          variant: 'error',
        })
        setRows([])
        setTotal(0)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [filtros, page, limit, busqueda, Alerta])

  /* ── Acciones ── */

  const handleBuscar = useCallback((nuevosFiltros: FiltrosBusquedaApd) => {
    setFiltros(nuevosFiltros)
    setBusqueda('')
    setBusquedaInput('')
    setPage(1)
    setBuscado(true)
  }, [])

  const handleLimpiar = useCallback(() => {
    setFiltros(null)
    setRows([])
    setTotal(0)
    setBuscado(false)
    setBusqueda('')
    setBusquedaInput('')
    setPage(1)
  }, [])

  const handleExportar = useCallback(
    async (
      formato: FormatoExportacion,
      filtrosActuales: FiltrosBusquedaApd
    ) => {
      setExportando(formato)
      try {
        const { blob, nombreArchivo } = await BusquedaGeneralApdApi.exportar(
          formato,
          filtrosActuales
        )
        descargar(blob, nombreArchivo)
      } catch (e) {
        Alerta({
          mensaje: InterpreteMensajes(e) || 'No se pudo generar el archivo.',
          variant: 'error',
        })
      } finally {
        setExportando(null)
      }
    },
    [Alerta]
  )

  const handleVerActuaciones = useCallback((fila: FilaCasoApd) => {
    setCasoDetalle(fila)
  }, [])

  const hayResultados = !cargando && rows.length > 0

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center gap-3">
          <Icono className="w-6 h-6 text-primary">manage_search</Icono>
          <div>
            <h1 className="text-lg font-semibold text-dark dark:text-white-light">
              Búsqueda general APD
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Filtra casos combinando criterios de caso, personas, bienes y
              empresas
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosBusquedaGeneralApd
        catalogos={catalogos}
        cargandoCatalogos={cargandoCatalogos}
        onBuscar={handleBuscar}
        onLimpiar={handleLimpiar}
        onExportar={handleExportar}
        onError={(mensaje) => Alerta({ mensaje, variant: 'warning' })}
        cargando={cargando}
        exportando={exportando}
      />

      {/* Resultados */}
      <div className="panel">
        <div className="mb-3 flex items-center gap-2 border-b border-[#e0e6ed] pb-2 dark:border-[#1b2e4b]">
          <Icono className="w-4 h-4 text-gray-500">table_chart</Icono>
          <h2 className="text-sm font-semibold">Casos encontrados</h2>
          {hayResultados && (
            <span className="badge badge-outline-info ml-auto text-xs">
              {total} {total === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>

        <TablaCasosApd
          rows={rows}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={cargando}
          buscado={buscado}
          busqueda={busquedaInput}
          onBusquedaChange={onBusquedaChange}
          onVerActuaciones={handleVerActuaciones}
        />
      </div>

      {/* Detalle */}
      <PanelDetalleCasoApd
        caso={casoDetalle}
        onClose={() => setCasoDetalle(null)}
      />
    </div>
  )
}
