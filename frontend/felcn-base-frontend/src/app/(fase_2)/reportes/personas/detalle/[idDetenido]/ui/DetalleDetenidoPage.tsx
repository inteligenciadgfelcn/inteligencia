'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAlerts } from '@/hooks/useAlerts'
import { Icono } from '@/components/Icono'
import IconArrowBackward from '@/components/Icon/IconArrowBackward'
import { InterpreteMensajes } from '@/utils'
import { getDetalleDetenido } from '../../../services/detenido.service'
import type { DetalleDetenido } from '../../../types/detenido.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Campo({ etiqueta, valor }: { etiqueta: string; valor?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">{etiqueta}</dt>
      <dd className="text-sm text-gray-800 dark:text-gray-200">{valor ?? '—'}</dd>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Tab = 'personales' | 'documentos' | 'aliases' | 'fenotipo' | 'profesiones' | 'familiares' | 'nombres_supuestos' | 'huellas'

export function DetalleDetenidoPage({ idDetenido }: { idDetenido: string }) {
  const { Alerta } = useAlerts()
  const router = useRouter()
  const [detalle, setDetalle] = useState<DetalleDetenido | null>(null)
  const [cargando, setCargando] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('personales')

  useEffect(() => {
    let activo = true
    setCargando(true)
    getDetalleDetenido(idDetenido)
      .then(res => {
        if (activo) setDetalle(res)
      })
      .catch(e => {
        if (activo) Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => { activo = false }
  }, [idDetenido, Alerta])

  const dp = detalle?.datosPersonales

  const TABS: { id: Tab; label: string; icono: string; count?: number }[] = [
    { id: 'personales', label: 'Datos Personales', icono: 'person' },
    { id: 'documentos', label: 'Documentos', icono: 'description', count: detalle?.documentos.length },
    { id: 'aliases', label: 'Alias', icono: 'edit', count: detalle?.aliases.length },
    { id: 'fenotipo', label: 'Fenotipo', icono: 'view_module' },
    { id: 'profesiones', label: 'Profesiones', icono: 'assignment', count: detalle?.profesiones.length },
    { id: 'familiares', label: 'Familiares', icono: 'group', count: detalle?.familiares.length },
    { id: 'nombres_supuestos', label: 'Nombres Supuestos', icono: 'person', count: detalle?.nombresSupuestos.length },
    { id: 'huellas', label: 'Huellas', icono: 'view_list', count: detalle?.huellas.length },
  ]

  return (
    <div className="space-y-4">

      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icono className="w-6 h-6 text-primary">manage_accounts</Icono>
            <div>
              <h1 className="text-lg font-semibold">Detalle de Persona</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {dp?.nombreCompleto || 'Cargando...'}
                {dp?.nombreCompleto && detalle?.numeroCaso ? ` — ${detalle.numeroCaso}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-gray-100 dark:bg-[#1b2e4b]/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1b2e4b] transition-colors"
            onClick={() => router.push('/reportes/personas')}
          >
            <IconArrowBackward className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>

      {/* Cargando */}
      {cargando && (
        <div className="panel flex items-center justify-center py-16 text-gray-400">
          <Icono className="w-6 h-6 mr-2 animate-spin">refresh</Icono>
          Cargando detalle...
        </div>
      )}

      {/* Sin datos */}
      {!cargando && !detalle && (
        <div className="panel flex flex-col items-center justify-center py-16 text-gray-400">
          <Icono className="w-10 h-10 mb-2 opacity-50">cancel</Icono>
          <p className="text-sm">No se pudo obtener el detalle de la persona</p>
        </div>
      )}

      {!cargando && detalle && (
        <div className="panel">
          {/* Tabs header */}
          <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] mb-4 -mx-[1.25rem] px-[1.25rem]">
            {TABS.map(tab => {
              const activo = activeTab === tab.id
              const sinContenido =
                (tab.count !== undefined && tab.count === 0) ||
                (tab.id === 'fenotipo' && !detalle.fenotipo)
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={sinContenido}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-2 transition-all
                    ${activo
                      ? 'border-primary text-primary bg-primary/5'
                      : sinContenido
                        ? 'border-transparent text-gray-300 dark:text-gray-700 cursor-not-allowed'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <Icono className={`w-4 h-4 ${activo ? 'text-primary' : ''}`}>{tab.icono}</Icono>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                      ${activo ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Datos Personales ─────────────────────────────────────────── */}
          {activeTab === 'personales' && dp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              <Campo etiqueta="Nombre completo" valor={dp.nombreCompleto} />
              <Campo etiqueta="Fecha de nacimiento" valor={dp.fechaNacimiento ? new Date(dp.fechaNacimiento).toLocaleDateString() : ''} />
              <Campo etiqueta="País" valor={dp.pais} />
              <Campo etiqueta="Estado civil" valor={dp.estadoCivil} />
              <Campo etiqueta="Dirección" valor={dp.direccion} />
              <Campo etiqueta="¿Vivo?" valor={dp.estaVivo ? 'Sí' : 'No'} />
              <Campo etiqueta="¿Tiene tarjeta?" valor={dp.tieneTarjeta ? 'Sí' : 'No'} />
              <Campo etiqueta="Fecha ingreso SII" valor={dp.fechaIngreso ? new Date(dp.fechaIngreso).toLocaleString() : ''} />
            </div>
          )}

          {/* ── Documentos ───────────────────────────────────────────────── */}
          {activeTab === 'documentos' && (
            <div className="space-y-2">
              {detalle.documentos.map(doc => (
                <div key={doc.id} className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{doc.tipo}</span>
                    <span className="text-sm">{doc.numero}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{doc.expedido ? `Expedido: ${doc.expedido}` : ''}</span>
                    {doc.contrastadoSegip && (
                      <span className="badge badge-outline-success text-[10px]">{doc.contrastadoSegip}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Aliases ──────────────────────────────────────────────────── */}
          {activeTab === 'aliases' && (
            <div className="flex flex-wrap gap-2">
              {detalle.aliases.map(alias => (
                <span key={alias.id} className="badge badge-outline-secondary text-sm">{alias.descripcion}</span>
              ))}
            </div>
          )}

          {/* ── Fenotipo ─────────────────────────────────────────────────── */}
          {activeTab === 'fenotipo' && detalle.fenotipo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              <Campo etiqueta="Estatura" valor={detalle.fenotipo.estatura} />
              <Campo etiqueta="Peso" valor={detalle.fenotipo.peso} />
              <Campo etiqueta="Señas particulares" valor={detalle.fenotipo.senasParticulares} />
              <Campo etiqueta="Nariz" valor={detalle.fenotipo.nariz} />
              <Campo etiqueta="Constitución corporal" valor={detalle.fenotipo.constitucionCorporal} />
              <Campo etiqueta="Color de piel" valor={detalle.fenotipo.colorPiel} />
              <Campo etiqueta="Color de cabello" valor={detalle.fenotipo.colorCabello} />
              <Campo etiqueta="Tipo de cabello" valor={detalle.fenotipo.tipoCabello} />
              <Campo etiqueta="Color de ojos" valor={detalle.fenotipo.colorOjos} />
              <Campo etiqueta="Tipo de ojos" valor={detalle.fenotipo.tipoOjos} />
            </div>
          )}

          {/* ── Profesiones ──────────────────────────────────────────────── */}
          {activeTab === 'profesiones' && (
            <div className="flex flex-wrap gap-2">
              {detalle.profesiones.map(prof => (
                <span key={prof.id} className="badge badge-outline-secondary text-sm">{prof.descripcion}</span>
              ))}
            </div>
          )}

          {/* ── Familiares ───────────────────────────────────────────────── */}
          {activeTab === 'familiares' && (
            <div className="space-y-2">
              {detalle.familiares.map(fam => (
                <div key={fam.id} className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {[fam.nombres, fam.paterno, fam.materno].filter(Boolean).join(' ')}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{fam.parentezco}</span>
                  </div>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>Edad: {fam.edad || '—'}</span>
                    <span>Dirección: {fam.direccion || '—'}</span>
                    <span>Teléfono: {fam.telefono || '—'}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {fam.vivo && <span className="badge badge-outline-success text-[10px]">Vivo</span>}
                    {fam.implicado && <span className="badge badge-outline-warning text-[10px]">Implicado</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Nombres Supuestos ────────────────────────────────────────── */}
          {activeTab === 'nombres_supuestos' && (
            <div className="space-y-2">
              {detalle.nombresSupuestos.map(ns => (
                <div key={ns.id} className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] p-3 flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-sm">
                    {[ns.nombres, ns.paterno, ns.materno, ns.apellidoEsposo].filter(Boolean).join(' ')}
                  </span>
                  {ns.cpq && <span className="badge badge-outline-info text-[10px]">CPQ: {ns.cpq}</span>}
                </div>
              ))}
            </div>
          )}

          {/* ── Huellas ──────────────────────────────────────────────────── */}
          {activeTab === 'huellas' && (
            <div className="space-y-2">
              {detalle.huellas.map(h => (
                <div key={h.id} className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] p-3 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium">{h.dedo}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Calidad: {h.calidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}