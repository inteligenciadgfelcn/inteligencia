'use client'

import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import type { SigCasoPreview, MarcadorSig } from '@/services/analisis'

type TipoMapa = 'normal' | 'fisico' | 'satelital' | 'hibrido'

const TILES: Record<TipoMapa, { url: string; overlay?: string }> = {
  normal: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  fisico: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  },
  satelital: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  hibrido: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    overlay: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  },
}

const BOTONES_MAPA: { tipo: TipoMapa; label: string; variant: string }[] = [
  { tipo: 'normal', label: 'Mapa Normal', variant: 'btn-success' },
  { tipo: 'fisico', label: 'Mapa Fisico', variant: 'btn-primary' },
  { tipo: 'satelital', label: 'Mapa Satelital', variant: 'btn-info' },
  { tipo: 'hibrido', label: 'Mapa Hibrido', variant: 'btn-warning' },
]

// Leaflet solo se renderiza en cliente
const Mapa = dynamic(() => import('@/components/mapas/Mapa'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-sm text-gray-400">
      Cargando mapa...
    </div>
  ),
})

const MarcadoresSig = dynamic(() => import('@/components/mapas/MarcadoresSig'), {
  ssr: false,
})

interface Props {
  open: boolean
  onClose: () => void
  data: SigCasoPreview | null
  onDescargarPdf: () => void
  descargando: boolean
}

const COLOR: Record<MarcadorSig['tipo'], string> = {
  blanco: '#dc2626',
  organizacion: '#2563eb',
  bien: '#16a34a',
}

const LEYENDA: { tipo: MarcadorSig['tipo']; label: string }[] = [
  { tipo: 'blanco', label: 'Personas Investigadas' },
  { tipo: 'organizacion', label: 'Organizaciones' },
  { tipo: 'bien', label: 'Bienes / Activos' },
]

const fmt = (f: string | null | undefined) => {
  if (!f) return 'N/A'
  const d = new Date(f)
  return isNaN(d.getTime()) ? f : d.toLocaleDateString('es-BO')
}

export function VistaPreviaSig({ open, onClose, data, onDescargarPdf, descargando }: Props) {
  const mapRef = useRef<any>(null)
  const [tipoMapa, setTipoMapa] = useState<TipoMapa>('normal')

  const { caso, marcadores } = data ?? { caso: null, marcadores: [] as MarcadorSig[] }

  const validos = marcadores.filter((m) => m.lat && m.lon && !isNaN(m.lat) && !isNaN(m.lon))

  const centro: [number, number] =
    validos.length > 0
      ? [
        validos.reduce((s, m) => s + m.lat, 0) / validos.length,
        validos.reduce((s, m) => s + m.lon, 0) / validos.length,
      ]
      : [-16.5, -68.1]

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl rounded-xl bg-white shadow-2xl dark:bg-[#0e1726]">

                {/* ── Encabezado institucional ── */}
                <div className="rounded-t-xl bg-gradient-to-r from-[#3e5f8a] to-[#1e3a5f] px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="text-base font-bold uppercase">Departamento de Inteligencia</p>
                      <p className="text-sm">REPORTE SIG — ACTIVIDAD DELICTUAL</p>
                      {caso && (
                        <p className="mt-1 text-sm font-semibold uppercase">CASO: {caso.nombreCaso}</p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="ml-4 rounded-full p-1 text-white/70 hover:bg-white/20 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* ── Contenido ── */}
                <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
                  {!data ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      Cargando datos...
                    </div>
                  ) : (
                    <>
                      {/* Datos Generales */}
                      <h4 className="mb-2 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
                        Datos Generales del Caso
                      </h4>
                      <div className="mb-5 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-white">
                              {['Registro Nro.', 'País de Investigación', 'Lugar', 'Estado', 'Etapa', 'Fecha Inicio'].map((h) => (
                                <th key={h} className="bg-[#5D7B9D] px-2 py-1 text-left">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-[#e5e7eb] px-2 py-1">{caso?.nroCasoCer ?? 'N/A'}</td>
                              <td className="border border-[#e5e7eb] px-2 py-1 text-[#3e5f8a]">{caso?.pais ?? 'N/A'}</td>
                              <td className="border border-[#e5e7eb] px-2 py-1">{caso?.lugar ?? 'N/A'}</td>
                              <td className="border border-[#e5e7eb] px-2 py-1 text-danger">{caso?.estadoCaso ?? 'N/A'}</td>
                              <td className="border border-[#e5e7eb] px-2 py-1">{caso?.etapaInvestigacion ?? 'N/A'}</td>
                              <td className="border border-[#e5e7eb] px-2 py-1">{fmt(caso?.fechaInicio)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Mapa GIS */}
                      <h4 className="mb-2 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
                        SIG de Actividad Delictual
                      </h4>

                      {/* Leyenda */}
                      <div className="mb-3 flex flex-wrap gap-4 text-xs">
                        {LEYENDA.map((l) => {
                          const count = marcadores.filter((m) => m.tipo === l.tipo).length
                          return (
                            <div key={l.tipo} className="flex items-center gap-1.5">
                              <span
                                className="inline-block h-3.5 w-3.5 rounded-full"
                                style={{ background: COLOR[l.tipo] }}
                              />
                              <span>{l.label} ({count})</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Botones de tipo de mapa */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        {BOTONES_MAPA.map((b) => (
                          <button
                            key={b.tipo}
                            type="button"
                            onClick={() => setTipoMapa(b.tipo)}
                            className={`btn btn-sm ${b.variant} ${tipoMapa === b.tipo ? 'opacity-100 ring-2 ring-offset-1 ring-current' : 'opacity-70 hover:opacity-100'}`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>

                      {/* Mapa Leaflet interactivo */}
                      <div className="overflow-hidden rounded-lg border-2 border-[#3e5f8a]">
                        <Mapa
                          id={`mapa-gis-preview-${caso?.idCaso ?? 'x'}`}
                          mapRef={mapRef}
                          centro={centro}
                          zoom={validos.length > 0 ? 12 : 6}
                          height={420}
                          scrollWheelZoom
                          tileUrl={TILES[tipoMapa].url}
                          tileUrlOverlay={TILES[tipoMapa].overlay}
                          markers={<MarcadoresSig marcadores={validos} color={COLOR} />}
                        />
                      </div>

                      {validos.length === 0 && (
                        <p className="mt-2 text-center text-xs italic text-gray-400">
                          No hay marcadores SIG registrados para este caso.
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-[#e0e6ed] px-6 py-3 dark:border-[#1b2e4b]">
                  <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    loading={descargando}
                    disabled={!data || descargando}
                    onClick={onDescargarPdf}
                  >
                    <IconDownload className="mr-1 h-4 w-4" />
                    Descargar PDF SIG
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
