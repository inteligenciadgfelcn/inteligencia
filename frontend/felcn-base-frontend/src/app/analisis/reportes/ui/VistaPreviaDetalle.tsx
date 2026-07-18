'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@/components/ui/Button'
import IconDownload from '@/components/Icon/IconDownload'
import { formatDecimal } from '@/utils/formatDecimal'
import type {
  DetalleCasoPreview,
  BlancoDetallePreview,
  OrganizacionDetallePreview,
  BienDetallePreview,
} from '@/services/analisis'

interface Props {
  open: boolean
  onClose: () => void
  data: DetalleCasoPreview | null
  onDescargarPdf: () => void
  descargando: boolean
}

const fmt = (f: string | null | undefined) => {
  if (!f) return 'N/A'
  const d = new Date(f)
  return isNaN(d.getTime()) ? f : d.toLocaleDateString('es-BO')
}

const vacio = (label: string, cols: number) => (
  <tr>
    <td colSpan={cols} className="py-2 text-center text-xs italic text-gray-400">
      Sin {label} registrados
    </td>
  </tr>
)

function SeccionBlanco({ b }: { b: BlancoDetallePreview }) {
  return (
    <div className="mb-4 rounded border border-[#3e5f8a]/30 p-4">
      <table className="mb-3 w-full text-sm">
        <tbody>
          {[
            ['Nombre(s)', b.deNombres],
            ['Apellido Paterno', b.dePaterno],
            ['Apellido Materno', b.deMaterno],
            ['Apellido del Esposo', b.deEsposo],
            ['Nacionalidad', b.descripcionPais ?? 'N/A'],
            ['Alias', b.alias],
          ].map(([lbl, val]) => (
            <tr key={lbl} className="border-b border-[#e5e7eb] dark:border-[#1b2e4b]">
              <td className="w-44 py-1 pr-3 font-semibold text-[#3e5f8a]">{lbl}</td>
              <td className="py-1">{val || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mb-1 text-center text-xs font-bold uppercase text-[#1e3a8a]">
        Antecedentes por Delitos Cometidos
      </p>
      <div className="table-responsive mb-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white">
              {['Tipo Delito', 'País', 'Lugar', 'Nro. Caso', 'Fecha', 'Hecho'].map((h) => (
                <th key={h} className="bg-[#5D7B9D] px-2 py-1 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.antecedentes.length === 0
              ? vacio('antecedentes', 6)
              : b.antecedentes.map((a, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                  <td className="border border-[#e5e7eb] px-2 py-1">{a.descripcionTipoDelito ?? 'N/A'}</td>
                  <td className="bord er border-[#e5e7eb] px-2 py-1">{a.descripcionPais ?? 'N/A'}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{a.lugarHecho}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{a.nroCaso}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{fmt(a.fechaHecho)}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{a.hecho}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mb-1 text-center text-xs font-bold uppercase text-[#1e3a8a]">
        Redes Sociales y Correo
      </p>
      <div className="mb-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white">
              <th className="bg-[#5D7B9D] px-2 py-1 text-left">Red Social / Correo</th>
              <th className="bg-[#5D7B9D] px-2 py-1 text-left">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {b.redesSociales.length === 0
              ? vacio('redes sociales', 2)
              : b.redesSociales.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                  <td className="border border-[#e5e7eb] px-2 py-1">{r.tipoRed}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{r.direccion}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <p className="mb-1 text-center text-xs font-bold uppercase text-[#1e3a8a]">
        Lugares de Frecuencia
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white">
              {['Descripción', 'Latitud', 'Longitud', 'Motivo'].map((h) => (
                <th key={h} className="bg-[#5D7B9D] px-2 py-1 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.lugares.length === 0
              ? vacio('lugares', 4)
              : b.lugares.map((l, i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                  <td className="border border-[#e5e7eb] px-2 py-1">{l.descripcion}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{formatDecimal(l.coordenadasX, 6)}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{formatDecimal(l.coordenadasY, 6)}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{l.contenido}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SeccionOrganizacion({ o }: { o: OrganizacionDetallePreview }) {
  return (
    <div className="mb-4 rounded border border-[#3e5f8a]/30 p-4">
      <table className="mb-3 w-full text-sm">
        <tbody>
          {[
            ['Tipo de Organización', o.descripcionTipoOrganizacion ?? 'N/A'],
            ['Nombre / Razón Social', o.nombre],
            ['NIT', o.nit],
            ['Matrícula de Comercio', o.matricula],
            ['Representante Legal', o.representante],
            ['Observaciones', o.observaciones],
          ].map(([lbl, val]) => (
            <tr key={lbl} className="border-b border-[#e5e7eb] dark:border-[#1b2e4b]">
              <td className="w-52 py-1 pr-3 font-semibold text-[#3e5f8a]">{lbl}</td>
              <td className="py-1">{val || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mb-1 text-center text-xs font-bold uppercase text-[#1e3a8a]">
        Ubicación de la Organización
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white">
              {['Descripción', 'Latitud', 'Longitud', 'Motivo'].map((h) => (
                <th key={h} className="bg-[#5D7B9D] px-2 py-1 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {o.lugares.length === 0
              ? vacio('ubicaciones', 4)
              : o.lugares.map((l, i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
                  <td className="border border-[#e5e7eb] px-2 py-1">{l.descripcion}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{formatDecimal(l.coordenadasX, 6)}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{formatDecimal(l.coordenadasY, 6)}</td>
                  <td className="border border-[#e5e7eb] px-2 py-1">{l.contenido}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SeccionBienes({ bienes }: { bienes: BienDetallePreview[] }) {
  if (bienes.length === 0)
    return <p className="text-xs italic text-gray-400">Sin bienes registrados.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-white">
            {['Catálogo Bien', 'Clase', 'Tipo', 'Tipo Investigación', 'Características'].map((h) => (
              <th key={h} className="bg-[#5D7B9D] px-2 py-1 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bienes.map((b, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-[#f7f6f3] dark:bg-[#0e1726]/30'}>
              <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionBien ?? 'N/A'}</td>
              <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionClase ?? 'N/A'}</td>
              <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionTipo ?? 'N/A'}</td>
              <td className="border border-[#e5e7eb] px-2 py-1 align-top">{b.descripcionTipoInvestigacion ?? 'N/A'}</td>
              <td className="border border-[#e5e7eb] px-2 py-1 align-top">
                {b.caracteristicas.length === 0 ? (
                  <span className="italic text-gray-400">—</span>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-white">
                        <th className="bg-[#8fafc8] px-1 py-0.5 text-left">Característica</th>
                        <th className="bg-[#8fafc8] px-1 py-0.5 text-left">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.caracteristicas.map((c, j) => (
                        <tr key={j}>
                          <td className="border border-[#e5e7eb] px-1 py-0.5">{c.descripcionCaracteristica ?? 'N/A'}</td>
                          <td className="border border-[#e5e7eb] px-1 py-0.5">{c.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function VistaPreviaDetalle({ open, onClose, data, onDescargarPdf, descargando }: Props) {
  const { caso, blancos, organizaciones, bienes } = data ?? {
    caso: null,
    blancos: [],
    organizaciones: [],
    bienes: [],
  }

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
                      <p className="text-sm">REPORTE DE CASO — ALIANZA LATINOAMERICANA ANTINARCÓTICOS</p>
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

                      {/* Investigados */}
                      <h4 className="mb-3 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
                        Investigados
                      </h4>
                      {blancos.length === 0 ? (
                        <p className="mb-4 text-xs italic text-gray-400">Sin investigados registrados.</p>
                      ) : (
                        blancos.map((b) => <SeccionBlanco key={b.idBlanco} b={b} />)
                      )}

                      {/* Organizaciones */}
                      <h4 className="mb-3 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
                        Organizaciones
                      </h4>
                      {organizaciones.length === 0 ? (
                        <p className="mb-4 text-xs italic text-gray-400">Sin organizaciones registradas.</p>
                      ) : (
                        organizaciones.map((o) => <SeccionOrganizacion key={o.idEmpresa} o={o} />)
                      )}

                      {/* Bienes */}
                      <h4 className="mb-3 border-b-2 border-[#3e5f8a] pb-1 text-sm font-bold uppercase text-[#3e5f8a]">
                        Bienes y/o Activos en Investigación
                      </h4>
                      <SeccionBienes bienes={bienes} />
                    </>
                  )}
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-[#e0e6ed] px-6 py-3 dark:border-[#1b2e4b]">
                  <Button variant="outline-secondary" size="sm" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={descargando}
                    disabled={!data || descargando}
                    onClick={onDescargarPdf}
                  >
                    <IconDownload className="mr-1 h-4 w-4" />
                    Descargar PDF
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
