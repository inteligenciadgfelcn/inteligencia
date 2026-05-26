'use client'

import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { Marker } from 'react-leaflet'
import { icon } from 'leaflet'
import { Button } from '@/components/ui/Button'
import IconPrinter from '@/components/Icon/IconPrinter'
import { BASE_PATH } from '@/imageLoader'
import type { PreviewOperativoData } from '@/services/reportes/ReportesOperativoService'

const Mapa = dynamic(() => import('@/components/mapas/Mapa'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-sm text-gray-400">
      Cargando mapa...
    </div>
  ),
})

interface Props {
  open: boolean
  onClose: () => void
  data: PreviewOperativoData | null
  tipo: 'operativo' | 'general'
  urlPdf: string | null
}

const ICON = icon({
  iconUrl: `${BASE_PATH}/leaflet/marker-icon.png`,
  shadowUrl: `${BASE_PATH}/leaflet/marker-shadow.png`,
  iconAnchor: [12.5, 41],
})

const fmt = (n: any) =>
  (parseFloat(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtFecha = (f: string | null | undefined) => {
  if (!f) return 'N/A'
  const d = new Date(f)
  return isNaN(d.getTime()) ? f : d.toLocaleString('es-BO')
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
      {children}
    </h4>
  )
}

function TablaSimple({
  headers,
  rows,
  vacio,
}: {
  headers: string[]
  rows: (string | number | null | undefined)[][]
  vacio: string
}) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#5D7B9D] text-white">
            {headers.map((h) => (
              <th key={h} className="px-2 py-1 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-2 text-center italic text-gray-400">{vacio}</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                {r.map((c, j) => (
                  <td key={j} className="border border-[#e5e7eb] px-2 py-1 align-top">{c ?? '—'}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function VistaPreviaOperativo({ open, onClose, data, tipo, urlPdf }: Props) {
  const mapRef = useRef<any>(null)

  const titulo =
    tipo === 'operativo'
      ? 'FORMULARIO ÚNICO DE REGISTRO DE OPERATIVOS ANTINARCÓTICOS'
      : 'REPORTE GENERAL DEL CASO'

  const {
    caso,
    operativo,
    drogas,
    sustanciasSolidas,
    sustanciasLiquidas,
    fabricas,
    personas,
    bienes,
    galerias,
    mapaCoords,
  } = data ?? {
    caso: null,
    operativo: null,
    drogas: [],
    sustanciasSolidas: [],
    sustanciasLiquidas: [],
    fabricas: [],
    personas: [],
    bienes: [],
    galerias: [],
    mapaCoords: null,
  }

  const centro: [number, number] =
    mapaCoords ? [mapaCoords.lat, mapaCoords.lon] : [-16.5, -68.1]

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl rounded-xl bg-white shadow-2xl dark:bg-[#0e1726]">

                {/* ── Encabezado ── */}
                <div className="rounded-t-xl bg-gradient-to-r from-[#3e5f8a] to-[#1e3a5f] px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="text-base font-bold uppercase">{titulo}</p>
                      {caso && (
                        <>
                          <p className="text-sm">Nombre del Caso: <strong>{caso.nombreCaso}</strong></p>
                          <p className="text-sm">Número: <strong>{caso.numeroOperativo}</strong></p>
                        </>
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
                      <TituloSeccion>Datos Generales</TituloSeccion>
                      <div className="mb-5 rounded border border-[#3e5f8a]/20 p-3">
                        <dl className="grid grid-cols-1 gap-y-1 text-xs sm:grid-cols-2">
                          {[
                            ['Número de Operativo', operativo?.numeroOperativo],
                            ['Asignado al Caso', caso?.asignadoCaso],
                            ['Fiscal Asignado', caso?.fiscalAsignadoCaso],
                            ['Fecha y Hora', fmtFecha(operativo?.fechaOperativo)],
                            ['Lugar', operativo?.lugar],
                            ['Unidad Operativa', operativo?.descripcionUnidad],
                            ['Plan de Operaciones', operativo?.descripcionPlanOperaciones],
                            ['Tipo de Operativo', operativo?.descripcionTipoOperativo],
                          ].map(([lbl, val]) => (
                            <div key={lbl} className="flex gap-1">
                              <dt className="font-semibold text-[#3e5f8a] shrink-0">{lbl}:</dt>
                              <dd className="text-gray-700 dark:text-gray-300">{val || '—'}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      {/* Breve Detalle */}
                      {(operativo?.breveDetalle || operativo?.descripcion) && (
                        <>
                          <TituloSeccion>Breve Detalle del Operativo</TituloSeccion>
                          <p className="mb-5 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                            {operativo?.breveDetalle || operativo?.descripcion}
                          </p>
                        </>
                      )}

                      {/* Mapa */}
                      <TituloSeccion>Mapa de Ubicación</TituloSeccion>
                      {mapaCoords ? (
                        <div className="mb-5 overflow-hidden rounded-lg border-2 border-[#3e5f8a]">
                          <Mapa
                            id={`mapa-preview-op-${operativo?.id ?? 'x'}`}
                            mapRef={mapRef}
                            centro={centro}
                            zoom={14}
                            height={300}
                            scrollWheelZoom
                            markers={<Marker position={centro} icon={ICON} />}
                          />
                        </div>
                      ) : (
                        <p className="mb-5 text-xs italic text-gray-400">Sin coordenadas registradas para este operativo.</p>
                      )}

                      {/* Drogas */}
                      <TituloSeccion>Drogas, Psicotrópicos y Estupefacientes</TituloSeccion>
                      <TablaSimple
                        headers={['Tipo de Droga', 'Estado', 'Cantidad (g)', 'Costo (Bs)', 'Transporte', 'Procedencia', 'Destino']}
                        rows={drogas.map((d) => [
                          d.descripcionTipoDroga,
                          d.descripcionEstadoDroga,
                          fmt(d.cantidadGramos ?? d.cantidad),
                          fmt(d.costo),
                          d.descripcionFormaTransporte,
                          d.descripcionPaisProcedencia,
                          d.descripcionPaisDestino,
                        ])}
                        vacio="Sin drogas registradas"
                      />

                      {/* Sustancias sólidas */}
                      <TituloSeccion>Sustancias Químicas Sólidas</TituloSeccion>
                      <TablaSimple
                        headers={['Nombre', 'Kilos', 'Costo (Bs)']}
                        rows={sustanciasSolidas.map((s) => [s.descripcionSustancia, fmt(s.cantidad), fmt(s.costo)])}
                        vacio="Sin sustancias sólidas registradas"
                      />

                      {/* Sustancias líquidas */}
                      <TituloSeccion>Sustancias Químicas Líquidas</TituloSeccion>
                      <TablaSimple
                        headers={['Nombre', 'Litros', 'Costo (Bs)']}
                        rows={sustanciasLiquidas.map((s) => [s.descripcionSustancia, fmt(s.cantidad), fmt(s.costo)])}
                        vacio="Sin sustancias líquidas registradas"
                      />

                      {/* Fábricas */}
                      <TituloSeccion>Laboratorios y Fábricas</TituloSeccion>
                      <TablaSimple
                        headers={['Tipo de Elaboración', 'Estilo', 'Cantidad']}
                        rows={fabricas.map((f) => [f.descripcionTipoFabrica, f.descripcionFabricaModelo, f.cantidad])}
                        vacio="Sin laboratorios o fábricas registrados"
                      />

                      {/* Personas */}
                      <TituloSeccion>Personas: Principal Implicado / Aprehendidas / Arrestadas / LGI</TituloSeccion>
                      {personas.length === 0 ? (
                        <p className="mb-4 text-xs italic text-gray-400">Sin personas registradas.</p>
                      ) : (
                        <div className="mb-4 space-y-3">
                          {personas.map((p, i) => (
                            <div key={i} className="rounded border border-[#3e5f8a]/30 p-3">
                              <p className="mb-1 text-sm font-bold text-dark dark:text-white">
                                {[p.nombres, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ') || 'N/A'}
                              </p>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs sm:grid-cols-3">
                                {[
                                  ['Nacionalidad', p.descripcionPais],
                                  ['Género', p.genero],
                                  ['F. Nacimiento', p.fechaNacimiento ? new Date(p.fechaNacimiento).toLocaleDateString('es-BO') : null],
                                  ['Estado Civil', p.descripcionEstadoCivil],
                                  ['Tipo Doc.', p.descripcionTipoDocumento],
                                  ['Nro. Doc.', p.nroDocumento],
                                  ['Dirección', p.direccion],
                                  ['Estado', p.estado],
                                ].map(([lbl, val]) => (
                                  <div key={lbl} className="flex gap-1">
                                    <dt className="font-semibold text-[#3e5f8a] shrink-0">{lbl}:</dt>
                                    <dd className="text-gray-600 dark:text-gray-400">{val || '—'}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bienes */}
                      <TituloSeccion>Bienes u Objetos Secuestrados</TituloSeccion>
                      <div className="mb-4 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-[#5D7B9D] text-white">
                              {['Catálogo Bien', 'Clase', 'Tipo', 'Cant.', 'Características'].map((h) => (
                                <th key={h} className="px-2 py-1 text-left">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bienes.length === 0 ? (
                              <tr><td colSpan={5} className="py-2 text-center italic text-gray-400">Sin bienes registrados</td></tr>
                            ) : (
                              bienes.map((b, i) => (
                                <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                                  <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionBien ?? '—'}</td>
                                  <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionCatalogoClase ?? '—'}</td>
                                  <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionCatalogoTipo ?? '—'}</td>
                                  <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.cantidadBien ?? '—'}</td>
                                  <td className="border border-[#e5e7eb] px-2 py-1 align-top">
                                    {b.caracteristicas.length === 0 ? <span className="italic text-gray-400">—</span> : (
                                      <ul className="space-y-0.5">
                                        {b.caracteristicas.map((c, j) => (
                                          <li key={j}><strong>{c.label}:</strong> {c.value}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Galería */}
                      <TituloSeccion>Galería Fotográfica</TituloSeccion>
                      {galerias.length === 0 ? (
                        <p className="text-xs italic text-gray-400">Sin fotos de galería registradas.</p>
                      ) : (
                        <ul className="mb-2 space-y-1 text-xs">
                          {galerias.map((g, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="font-semibold text-[#3e5f8a]">#{i + 1}</span>
                              <span className="text-gray-600 dark:text-gray-300">{g.descripcion || 'Sin descripción'}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-[#e0e6ed] px-6 py-3 dark:border-[#1b2e4b]">
                  <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    Cerrar
                  </Button>
                  {urlPdf && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!data}
                      onClick={() => window.open(urlPdf, '_blank')}
                    >
                      <IconPrinter className="mr-1 h-4 w-4" />
                      Descargar PDF
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
