'use client'

import { useState } from 'react'
import type { ResultadoCruzada } from '@/services/reportes/CruzadosService'
import { Constantes } from '@/config/Constantes'
import IconPrinter from '@/components/Icon/IconPrinter'
import IconEye from '@/components/Icon/IconEye'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesOperativoService } from '@/services/reportes/ReportesOperativoService'
import type { PreviewOperativoData } from '@/services/reportes/ReportesOperativoService'
import { VistaPreviaOperativo } from '../../components/VistaPreviaOperativo'

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

// ─── Sección colapsable ───────────────────────────────────────────────────────

interface SeccionProps {
  titulo: string
  items: string[]
}

function Seccion({ titulo, items }: SeccionProps) {
  const [abierta, setAbierta] = useState(items.length > 0)
  const tieneItems = items.length > 0

  return (
    <div className="border-t border-[#e0e6ed] dark:border-[#1b2e4b]">
      <button
        type="button"
        disabled={!tieneItems}
        onClick={() => setAbierta(v => !v)}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold transition-colors
          ${tieneItems
            ? 'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-white/5'
            : 'cursor-default opacity-40'
          }`}
      >
        <span className="text-gray-700 dark:text-gray-300">{titulo}</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center text-xs font-bold w-5 h-5 rounded-full
            bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {items.length}
          </span>
          {tieneItems && (
            <svg
              className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          )}
        </div>
      </button>

      {abierta && tieneItems && (
        <div className="px-3 pb-2.5 flex flex-col gap-1">
          {items.map((item, i) => (
            <span
              key={i}
              className="text-xs leading-relaxed whitespace-pre-wrap text-left text-gray-700 dark:text-gray-300"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Card principal ───────────────────────────────────────────────────────────

export function OperativoCard({ row }: { row: ResultadoCruzada }) {
  const { Alerta } = useAlerts()
  const [modalOpen, setModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewOperativoData | null>(null)

  const abrirPreview = async () => {
    if (!row.numeroOperativo) return
    setPreviewData(null)
    setModalOpen(true)
    try {
      const res = await ReportesOperativoService.verPreviewGeneral(row.numeroOperativo)
      if (res?.finalizado) setPreviewData(res.datos)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      setModalOpen(false)
    }
  }

  const drogas = parsearItems(row.drogasDecomisadas)
  const sustSolidas = parsearItems(row.sustanciasSolidas)
  const sustLiquidas = parsearItems(row.sustanciasLiquidas)
  const laboratorios = parsearItems(row.laboratoriosFabricas)
  const arrestados = parsearItems(row.arrestados)
  const personasImpl = parsearItems(row.personasImplicadas)
  const bienesIncautados = parsearItems(row.bienesIncautados)

  // ubicacionInstitucional puede llegar como null o como '--' cuando los tres LEFT JOINs no retornan filas
  const unidadValida = row.ubicacionInstitucional?.replace(/-/g, '').trim()

  const urlPdf = row.numeroOperativo
    ? `${Constantes.baseUrl}/reportes/general/pdf?numero=${encodeURIComponent(row.numeroOperativo)}`
    : null

  return (
    <>
      <VistaPreviaOperativo
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={previewData}
        tipo="general"
        urlPdf={urlPdf}
      />
    <div className="panel p-0 overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b] shadow-none bg-white dark:bg-[#191e3a]">

      {/* ── Cabecera ──────────────────────────────────────────────────────── */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-black/10 dark:to-transparent">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Nro. Operativo + Nro. Caso */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                {row.numeroOperativo}
              </span>
              <span className="text-xs font-bold text-dark dark:text-white-light truncate">
                {row.numeroCaso}
              </span>
            </div>

            {/* Nombre del caso */}
            {row.nombreCaso && (
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 line-clamp-2" title={row.nombreCaso}>
                {row.nombreCaso}
              </p>
            )}

            {/* Asignado al caso */}
            {row.asignadoCaso && (
              <p className="text-[11px] text-gray-500 dark:text-gray-500 mt-0.5 truncate" title={row.asignadoCaso}>
                Asig.: {row.asignadoCaso}
              </p>
            )}
          </div>

          {/* Fecha del operativo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="text-info hover:text-info/75 transition-colors p-1 rounded hover:bg-info/5"
              onClick={() => void abrirPreview()}
              title="Vista Previa del Reporte General"
            >
              <IconEye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="text-success hover:text-success/75 transition-colors p-1 rounded hover:bg-success/5"
              onClick={() => {
                const num = row.numeroOperativo
                if (num) {
                  window.open(
                    `${Constantes.baseUrl}/reportes/general/pdf?numero=${encodeURIComponent(num)}`,
                    '_blank'
                  )
                }
              }}
              title="Descargar PDF Reporte General"
            >
              <IconPrinter className="h-4.5 w-4.5" />
            </button>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {row.fechaOperativo}
            </span>
          </div>
        </div>

        {/* Departamento · Provincia · Localidad · Lugar */}
        <div className="mt-1.5 space-y-0.5">
          {row.ubicacionGeografica && (
            <div className="flex items-start text-[11px] text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[3px] shrink-0 text-gray-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="whitespace-pre-line">{row.ubicacionGeografica}</span>
            </div>
          )}

          {/* Unidad · Distrital · Grupo */}
          {unidadValida && (
            <div className="flex items-start text-[11px] text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[3px] shrink-0 text-gray-400">
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                <path d="M9 22v-4h6v4"></path>
                <path d="M8 6h.01"></path>
                <path d="M16 6h.01"></path>
                <path d="M12 6h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M8 14h.01"></path>
              </svg>
              <span className="line-clamp-1" title={row.ubicacionInstitucional}>{row.ubicacionInstitucional}</span>
            </div>
          )}
        </div>

        {/* Hoja de Coca (cantidad total en kg) */}
        {row.totalHojaCoca && (
          <div className="mt-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              🌿 Hoja de Coca: {row.totalHojaCoca} kg
            </span>
          </div>
        )}
      </div>

      {/* ── Secciones de detalle ──────────────────────────────────────────── */}

      {/* op10: Tipo Droga · Estado Droga · Cantidad (grs) · Forma de Transporte */}
      <Seccion
        titulo="Drogas Decomisadas"
        items={drogas}
      />

      {/* op11: Sustancia sólida · Cantidad (grs) */}
      <Seccion
        titulo="Sustancias Precursoras Sólidas"
        items={sustSolidas}
      />

      {/* op12: Sustancia líquida · Cantidad (grs) */}
      <Seccion
        titulo="Sustancias Precursoras Líquidas"
        items={sustLiquidas}
      />

      {/* op13: Tipo Fábrica · Cantidad */}
      <Seccion
        titulo="Laboratorios y Fábricas"
        items={laboratorios}
      />

      {/* op14: arrestado_auxiliar — Nombre completo · Nacionalidad */}
      <Seccion
        titulo="Arrestados"
        items={arrestados}
      />

      {/* op15: persona_auxiliar (DETENIDOSAUX) — Nombre completo · País */}
      <Seccion
        titulo="Personas Implicadas"
        items={personasImpl}
      />

      {/* op16: item_bien_secuestrado — Tipo de bien */}
      <Seccion
        titulo="Bienes Incautados"
        items={bienesIncautados}
      />
    </div>
    </>
  )
}
