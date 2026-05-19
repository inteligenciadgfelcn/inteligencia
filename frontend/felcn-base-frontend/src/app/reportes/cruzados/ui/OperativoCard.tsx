'use client'

import { useState } from 'react'
import type { ResultadoCruzada } from '@/services/reportes/CruzadosService'
import { Constantes } from '@/config/Constantes'
import IconPrinter from '@/components/Icon/IconPrinter'

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

// ─── Sección colapsable ───────────────────────────────────────────────────────

interface SeccionProps {
  titulo: string
  items: string[]
  colorBadge: string
  colorTitulo: string
}

function Seccion({ titulo, items, colorBadge, colorTitulo }: SeccionProps) {
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
        <span className={colorTitulo}>{titulo}</span>
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center justify-center text-xs font-bold w-5 h-5 rounded-full
            ${tieneItems ? colorBadge : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'}`}>
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
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md leading-relaxed whitespace-pre-wrap text-left w-full ${colorBadge}`}
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
  const drogas = parsearItems(row.drogasDecomisadas)
  const sustSolidas = parsearItems(row.sustanciasSolidas)
  const sustLiquidas = parsearItems(row.sustanciasLiquidas)
  const laboratorios = parsearItems(row.laboratoriosFabricas)
  const arrestados = parsearItems(row.arrestados)
  const personasImpl = parsearItems(row.personasImplicadas)
  const bienesIncautados = parsearItems(row.bienesIncautados)

  // ubicacionInstitucional puede llegar como null o como '--' cuando los tres LEFT JOINs no retornan filas
  const unidadValida = row.ubicacionInstitucional?.replace(/-/g, '').trim()

  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-[#1a2941] shadow-sm overflow-hidden">

      {/* ── Cabecera ──────────────────────────────────────────────────────── */}
      <div className="px-3 py-2.5 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#1b2e4b]/50 dark:to-transparent">
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
              className="text-success hover:text-success/75 transition-colors p-1 rounded hover:bg-success/5"
              onClick={() => {
                const num = row.numeroOperativo
                if (num) {
                  window.open(
                    `${Constantes.baseUrl}/reportes/general/${encodeURIComponent(num)}/pdf`,
                    '_blank'
                  )
                }
              }}
              title="Imprimir Reporte General"
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
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded
              bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
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
        colorBadge="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        colorTitulo="text-amber-700 dark:text-amber-400"
      />

      {/* op11: Sustancia sólida · Cantidad (grs) */}
      <Seccion
        titulo="Sustancias Precursoras Sólidas"
        items={sustSolidas}
        colorBadge="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
        colorTitulo="text-purple-700 dark:text-purple-400"
      />

      {/* op12: Sustancia líquida · Cantidad (grs) */}
      <Seccion
        titulo="Sustancias Precursoras Líquidas"
        items={sustLiquidas}
        colorBadge="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        colorTitulo="text-blue-700 dark:text-blue-400"
      />

      {/* op13: Tipo Fábrica · Cantidad */}
      <Seccion
        titulo="Laboratorios y Fábricas"
        items={laboratorios}
        colorBadge="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        colorTitulo="text-red-700 dark:text-red-400"
      />

      {/* op14: arrestado_auxiliar — Nombre completo · Nacionalidad */}
      <Seccion
        titulo="Arrestados"
        items={arrestados}
        colorBadge="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
        colorTitulo="text-rose-700 dark:text-rose-400"
      />

      {/* op15: persona_auxiliar (DETENIDOSAUX) — Nombre completo · País */}
      <Seccion
        titulo="Personas Implicadas"
        items={personasImpl}
        colorBadge="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
        colorTitulo="text-indigo-700 dark:text-indigo-400"
      />

      {/* op16: item_bien_secuestrado — Tipo de bien */}
      <Seccion
        titulo="Bienes Incautados"
        items={bienesIncautados}
        colorBadge="bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800"
        colorTitulo="text-teal-700 dark:text-teal-400"
      />
    </div>
  )
}
