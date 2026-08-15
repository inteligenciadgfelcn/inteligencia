'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import IconTrash from '@/components/Icon/IconTrash'
import IconDownload from '@/components/Icon/IconDownload'
import IconCaretDown from '@/components/Icon/IconCaretDown'
import IconPaperclip from '@/components/Icon/IconPaperclip'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { exportToCSV } from '@/utils/tableExport'
import { formatDecimal } from '@/utils/formatDecimal'
import { BlancosService } from '@/services/analisis'
import type { BlancoS2i, FlujoFiscalia, FlujoTelefonico } from '@/services/analisis'

interface Props {
  blanco: BlancoS2i
}

// Número boliviano: 8 dígitos. IMEI: 15 dígitos. Lat/Lon: numérico con exactamente 6 decimales.
const RE_NUMERO = /^\d{8}$/
const RE_IMEI = /^\d{15}$/
const RE_LATLON = /^-?\d{1,3}\.\d{6}$/

const MSG_NUMERO = 'Debe contener exactamente 8 dígitos numéricos'
const MSG_IMEI = 'Debe contener exactamente 15 dígitos numéricos'
const MSG_LATLON = 'Numérico con 6 decimales (ej. -16.500000)'

const soloDigitos = (v: string, max: number) => v.replace(/\D/g, '').slice(0, max)
const soloDecimal = (v: string) => v.replace(/[^0-9.-]/g, '')

const formatLatLon = (v: string) => {
  if (v === '' || v === '-' || v === '.') return v
  let cleaned = v.replace(/[^0-9.-]/g, '')
  const isNegative = cleaned.startsWith('-')
  cleaned = cleaned.replace(/-/g, '')
  if (isNegative) cleaned = '-' + cleaned
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  const finalParts = cleaned.split('.')
  if (finalParts[1] !== undefined) {
    return finalParts[0] + '.' + finalParts[1].slice(0, 6)
  }
  return cleaned
}

const formatDuration = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`
}

// ── Formulario de detalle de llamada (Fiscalía) ───────────────────────────────
interface FlujoFiscaliaForm {
  servicio: string
  registro: string
  numeroA: string
  imeiA: string
  rbsA: string
  celdaA: string
  latA: string
  lonA: string
  numeroB: string
  titular: string
  imeiB: string
  rbsB: string
  celdaB: string
  latB: string
  lonB: string
  fechaHora: string
  duracion: string
}

const FISCALIA_VACIO: FlujoFiscaliaForm = {
  servicio: '',
  registro: '',
  numeroA: '',
  imeiA: '',
  rbsA: '',
  celdaA: '',
  latA: '',
  lonA: '',
  numeroB: '',
  titular: '',
  imeiB: '',
  rbsB: '',
  celdaB: '',
  latB: '',
  lonB: '',
  fechaHora: '',
  duracion: '',
}

// ── Importación de CSV de detalle de llamadas (formato "DETALLE DE TRÁFICO" de fiscalía) ──
const normalizarEncabezado = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toUpperCase()

/** Mapea encabezados normalizados del CSV a los campos del formulario de fiscalía. */
const MAPA_COLUMNAS_FISCALIA: Record<string, keyof FlujoFiscaliaForm | 'fecha' | 'hora'> = {
  'TIPO SERVICIO': 'servicio',
  'SERVICIO': 'servicio',
  'TIPO REGISTRO': 'registro',
  'REGISTRO': 'registro',
  'NUMERO A': 'numeroA',
  'IMEI A': 'imeiA',
  'RBS UTILIZADA A': 'rbsA',
  'RBS A': 'rbsA',
  'CELDA A': 'celdaA',
  'LATITUD CELDA A': 'latA',
  'LATITUD A': 'latA',
  'LONGITUD CELDA A': 'lonA',
  'LONGITUD A': 'lonA',
  'NUMERO B': 'numeroB',
  'TITULAR': 'titular',
  'IMEI B': 'imeiB',
  'RBS UTILIZADA B': 'rbsB',
  'RBS B': 'rbsB',
  'CELDA B': 'celdaB',
  'LATITUD CELDA B': 'latB',
  'LATITUD B': 'latB',
  'LONGITUD CELDA B': 'lonB',
  'LONGITUD B': 'lonB',
  'FECHA Y HORA': 'fechaHora',
  'FECHA': 'fecha',
  'Y HORA': 'hora',
  'HORA': 'hora',
  'DURACION': 'duracion',
}

/** Encabezado canónico (el que reconoce el parser) y fila de ejemplo para la plantilla descargable. */
const ENCABEZADOS_PLANTILLA_FISCALIA: [string, keyof FlujoFiscaliaForm][] = [
  ['TIPO SERVICIO', 'servicio'],
  ['TIPO REGISTRO', 'registro'],
  ['NUMERO A', 'numeroA'],
  ['IMEI A', 'imeiA'],
  ['RBS UTILIZADA A', 'rbsA'],
  ['CELDA A', 'celdaA'],
  ['LATITUD CELDA A', 'latA'],
  ['LONGITUD CELDA A', 'lonA'],
  ['NUMERO B', 'numeroB'],
  ['TITULAR', 'titular'],
  ['IMEI B', 'imeiB'],
  ['RBS UTILIZADA B', 'rbsB'],
  ['CELDA B', 'celdaB'],
  ['LATITUD CELDA B', 'latB'],
  ['LONGITUD CELDA B', 'lonB'],
  ['FECHA Y HORA', 'fechaHora'],
  ['DURACION', 'duracion'],
]

const FILA_EJEMPLO_FISCALIA: FlujoFiscaliaForm = {
  servicio: 'VOZ',
  registro: 'SALIENTE',
  numeroA: '70123456',
  imeiA: '123456789012345',
  rbsA: 'RBS-001',
  celdaA: 'CEL-01',
  latA: '-16.500000',
  lonA: '-68.150000',
  numeroB: '71234567',
  titular: 'JUAN PEREZ',
  imeiB: '123456789012346',
  rbsB: 'RBS-002',
  celdaB: 'CEL-02',
  latB: '-16.510000',
  lonB: '-68.160000',
  fechaHora: '17/06/2026 14:30:00',
  duracion: '00:05:32',
}

interface FilaOmitida {
  fila: number
  motivo: string
}

interface ResultadoImportacionCsv {
  totalFilas: number
  importados: number
  omitidos: FilaOmitida[]
}

const detectarDelimitadorCsv = (linea: string) => {
  const comas = (linea.match(/,/g) ?? []).length
  const puntoYComa = (linea.match(/;/g) ?? []).length
  return puntoYComa > comas ? ';' : ','
}

const parseLineaCsv = (linea: string, delimitador: string): string[] => {
  const resultado: string[] = []
  let actual = ''
  let entreComillas = false
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (entreComillas) {
      if (c === '"') {
        if (linea[i + 1] === '"') { actual += '"'; i++ } else { entreComillas = false }
      } else {
        actual += c
      }
    } else if (c === '"') {
      entreComillas = true
    } else if (c === delimitador) {
      resultado.push(actual)
      actual = ''
    } else {
      actual += c
    }
  }
  resultado.push(actual)
  return resultado
}

/** Convierte fechas tipo "17-06-2026 14:30:00", "17/06/2026 14:30" o ISO a "YYYY-MM-DDTHH:mm:ss". */
const parseFechaHoraCsv = (raw: string): string | null => {
  const v = raw.trim()
  if (!v) return null

  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})[T ]?(\d{2}):(\d{2})(:(\d{2}))?$/)
  if (iso) {
    const [, y, mo, d, h, mi, , s] = iso
    return `${y}-${mo}-${d}T${h}:${mi}:${s ?? '00'}`
  }

  const dmy = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})[T ]?(\d{1,2}):(\d{2})(:(\d{2}))?$/)
  if (dmy) {
    const [, d, mo, y, h, mi, , s] = dmy
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${mi}:${s ?? '00'}`
  }

  const soloFecha = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (soloFecha) {
    const [, d, mo, y] = soloFecha
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`
  }

  return null
}

// ── Sub-panel: llamadas de fiscalía de un flujo telefónico ───────────────────
function PanelFlujoFiscalia({ idFlujo }: { idFlujo: string }) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [cargando, setCargando] = useState(false)
  const [importando, setImportando] = useState(false)
  const [lista, setLista] = useState<FlujoFiscalia[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FlujoFiscaliaForm>(FISCALIA_VACIO)
  const [resultadoImportacion, setResultadoImportacion] = useState<ResultadoImportacionCsv | null>(null)
  const inputCsvRef = useRef<HTMLInputElement>(null)

  const descargarFormatoCsv = () => {
    exportToCSV<FlujoFiscaliaForm>(
      [FILA_EJEMPLO_FISCALIA],
      ENCABEZADOS_PLANTILLA_FISCALIA.map(([encabezado]) => encabezado),
      ENCABEZADOS_PLANTILLA_FISCALIA.map(([, campo]) => campo),
      'formato-flujo-fiscalia-ejemplo'
    )
  }

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarFlujoFiscalia(idFlujo)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idFlujo])

  useEffect(() => { void cargar() }, [cargar])

  const importarCsv = async (file: File) => {
    setImportando(true)
    setResultadoImportacion(null)
    try {
      const texto = await file.text()
      const lineas = texto.split(/\r?\n/).filter((l) => l.trim() !== '')
      if (lineas.length < 2) {
        Alerta({ mensaje: 'El archivo CSV no contiene datos', variant: 'warning' })
        return
      }
      const delimitador = detectarDelimitadorCsv(lineas[0])

      let idxEncabezado = -1
      let mejorConteo = 0
      for (let i = 0; i < Math.min(lineas.length, 10); i++) {
        const conteo = parseLineaCsv(lineas[i], delimitador)
          .map(normalizarEncabezado)
          .filter((c) => MAPA_COLUMNAS_FISCALIA[c]).length
        if (conteo > mejorConteo) { mejorConteo = conteo; idxEncabezado = i }
      }
      if (idxEncabezado === -1 || mejorConteo < 4) {
        Alerta({ mensaje: 'No se reconocieron las columnas del CSV de flujo fiscalía. Descargue el formato de ejemplo para verificar los encabezados.', variant: 'error' })
        return
      }

      const encabezados = parseLineaCsv(lineas[idxEncabezado], delimitador).map(normalizarEncabezado)

      let importados = 0
      const omitidos: FilaOmitida[] = []
      const totalFilas = lineas.length - idxEncabezado - 1

      for (let i = idxEncabezado + 1; i < lineas.length; i++) {
        const numFila = i - idxEncabezado
        const celdas = parseLineaCsv(lineas[i], delimitador)
        const fila: Partial<Record<keyof FlujoFiscaliaForm | 'fecha' | 'hora', string>> = {}
        encabezados.forEach((h, idx) => {
          const campo = MAPA_COLUMNAS_FISCALIA[h]
          if (campo) fila[campo] = (celdas[idx] ?? '').trim()
        })

        const fechaHora = fila.fechaHora
          ? parseFechaHoraCsv(fila.fechaHora)
          : fila.fecha
            ? parseFechaHoraCsv(`${fila.fecha} ${fila.hora ?? ''}`.trim())
            : null

        const latA = parseFloat((fila.latA ?? '').replace(',', '.'))
        const lonA = parseFloat((fila.lonA ?? '').replace(',', '.'))
        const latB = parseFloat((fila.latB ?? '').replace(',', '.'))
        const lonB = parseFloat((fila.lonB ?? '').replace(',', '.'))

        const camposRequeridos: [string, string | undefined][] = [
          ['Tipo Servicio', fila.servicio], ['Tipo Registro', fila.registro],
          ['Número A', fila.numeroA], ['IMEI A', fila.imeiA], ['RBS A', fila.rbsA], ['Celda A', fila.celdaA],
          ['Número B', fila.numeroB], ['Titular', fila.titular], ['IMEI B', fila.imeiB],
          ['RBS B', fila.rbsB], ['Celda B', fila.celdaB], ['Duración', fila.duracion],
        ]

        const motivos: string[] = []
        const faltantes = camposRequeridos.filter(([, v]) => !v).map(([label]) => label)
        if (faltantes.length > 0) motivos.push(`Falta(n): ${faltantes.join(', ')}`)
        if (!fechaHora) motivos.push('Fecha y Hora inválida o con formato no reconocido')
        if (isNaN(latA)) motivos.push('Latitud A inválida')
        if (isNaN(lonA)) motivos.push('Longitud A inválida')
        if (isNaN(latB)) motivos.push('Latitud B inválida')
        if (isNaN(lonB)) motivos.push('Longitud B inválida')

        if (motivos.length > 0) {
          omitidos.push({ fila: numFila, motivo: motivos.join(' · ') })
          continue
        }

        try {
          const r = await BlancosService.crearFlujoFiscalia(idFlujo, {
            servicio: fila.servicio!.slice(0, 15),
            registro: fila.registro!.slice(0, 50),
            numeroA: fila.numeroA!.slice(0, 15),
            imeiA: fila.imeiA!.slice(0, 50),
            rbsA: fila.rbsA!.slice(0, 25),
            celdaA: fila.celdaA!.slice(0, 10),
            latA,
            lonA,
            numeroB: fila.numeroB!.slice(0, 15),
            titular: fila.titular!.slice(0, 80),
            imeiB: fila.imeiB!.slice(0, 50),
            rbsB: fila.rbsB!.slice(0, 25),
            celdaB: fila.celdaB!.slice(0, 10),
            latB,
            lonB,
            fechaHora: fechaHora!,
            duracion: fila.duracion!.slice(0, 15),
          })
          if (r?.finalizado) importados++
          else omitidos.push({ fila: numFila, motivo: 'El servidor rechazó el registro' })
        } catch (e) {
          omitidos.push({ fila: numFila, motivo: InterpreteMensajes(e) })
        }
      }

      void cargar()
      setResultadoImportacion({ totalFilas, importados, omitidos })
      Alerta({
        mensaje: `Importación completada: ${importados} de ${totalFilas} registro(s) importado(s)${omitidos.length ? '. Revise el detalle de filas omitidas debajo del botón de importar.' : ''}`,
        variant: importados === 0 ? 'error' : omitidos.length ? 'warning' : 'success',
      })
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setImportando(false)
    }
  }

  const setTexto = (campo: keyof FlujoFiscaliaForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value.toUpperCase() }))
  }

  const setNumero = (campo: 'numeroA' | 'numeroB') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: soloDigitos(e.target.value, 8) }))
  }

  const setImei = (campo: 'imeiA' | 'imeiB') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: soloDigitos(e.target.value, 15) }))
  }

  const setLatLon = (campo: 'latA' | 'lonA' | 'latB' | 'lonB') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [campo]: formatLatLon(e.target.value) }))
  }

  const handleLatLonBlur = (campo: 'latA' | 'lonA' | 'latB' | 'lonB') => () => {
    setForm((prev) => {
      const v = prev[campo]
      const num = parseFloat(v)
      if (isNaN(num)) return prev
      return { ...prev, [campo]: num.toFixed(6) }
    })
  }

  const setDuracion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, duracion: formatDuration(e.target.value) }))
  }

  const setFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, fechaHora: e.target.value }))
  }

  const errores = {
    servicio: !form.servicio.trim(),
    registro: !form.registro.trim(),
    numeroA: !RE_NUMERO.test(form.numeroA),
    imeiA: !RE_IMEI.test(form.imeiA),
    rbsA: !form.rbsA.trim(),
    celdaA: !form.celdaA.trim(),
    latA: !RE_LATLON.test(form.latA),
    lonA: !RE_LATLON.test(form.lonA),
    numeroB: !RE_NUMERO.test(form.numeroB),
    titular: !form.titular.trim(),
    imeiB: !RE_IMEI.test(form.imeiB),
    rbsB: !form.rbsB.trim(),
    celdaB: !form.celdaB.trim(),
    latB: !RE_LATLON.test(form.latB),
    lonB: !RE_LATLON.test(form.lonB),
    fechaHora: !form.fechaHora,
    duracion: !form.duracion.trim(),
  }

  const esValido = Object.values(errores).every((e) => !e)
  const marcado = (campo: keyof typeof errores) => submitted && errores[campo]

  const guardar = async () => {
    setSubmitted(true)
    if (!esValido) return
    setCargando(true)
    try {
      const r = await BlancosService.crearFlujoFiscalia(idFlujo, {
        servicio: form.servicio.trim(),
        registro: form.registro.trim(),
        numeroA: form.numeroA,
        imeiA: form.imeiA,
        rbsA: form.rbsA.trim(),
        celdaA: form.celdaA.trim(),
        latA: parseFloat(form.latA),
        lonA: parseFloat(form.lonA),
        numeroB: form.numeroB,
        titular: form.titular.trim(),
        imeiB: form.imeiB,
        rbsB: form.rbsB.trim(),
        celdaB: form.celdaB.trim(),
        latB: parseFloat(form.latB),
        lonB: parseFloat(form.lonB),
        fechaHora: form.fechaHora,
        duracion: form.duracion.trim(),
      })
      if (r?.finalizado) {
        setForm(FISCALIA_VACIO)
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Llamada registrada', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (idFlujoFiscalia: string) => {
    confirm({
      texto: '¿Eliminar este registro de llamada?',
      onConfirm: async () => {
        setCargando(true)
        try { await BlancosService.eliminarFlujoFiscalia(idFlujoFiscalia); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  return (
    <div className="mt-3 space-y-3 rounded border border-[#e0e6ed] bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
      <LoadingDialog show={cargando || importando} />
      <ConfirmDialog />
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-gray-500">Detalle de llamadas (Fiscalía)</p>
        <div className="flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            type="button"
            onClick={descargarFormatoCsv}
            title="Descargar una plantilla CSV con los encabezados correctos y una fila de ejemplo"
          >
            <IconDownload className="mr-1 h-4 w-4" />
            Descargar formato
          </Button>
          <input
            ref={inputCsvRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importarCsv(file)
              e.target.value = ''
            }}
          />
          <Button
            variant="outline-primary"
            size="sm"
            type="button"
            disabled={importando}
            onClick={() => inputCsvRef.current?.click()}
            title='Importar CSV con columnas: Tipo servicio, Tipo registro, Numero A, Imei A, RBS utilizada A, Celda A, Latitud Celda A, Longitud celda A, Numero B, Titular, Imei B, RBS utilizada B, Celda B, Latitud celda B, Longitud celda B, Fecha y Hora, Duracion'
          >
            <IconPaperclip className="mr-1 h-4 w-4" />
            Importar CSV
          </Button>
        </div>
      </div>

      {resultadoImportacion && (
        <div className="rounded border border-[#e0e6ed] bg-white p-3 text-xs dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between gap-2">
            <p>
              <span className="font-semibold">Resultado de la importación:</span>{' '}
              <span className="text-success font-medium">{resultadoImportacion.importados} importado(s)</span>
              {' '}de {resultadoImportacion.totalFilas} fila(s) procesada(s)
              {resultadoImportacion.omitidos.length > 0 && (
                <span className="text-danger font-medium"> · {resultadoImportacion.omitidos.length} omitida(s)</span>
              )}
            </p>
            <button
              type="button"
              className="text-lg leading-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setResultadoImportacion(null)}
              title="Cerrar"
            >
              ×
            </button>
          </div>
          {resultadoImportacion.omitidos.length > 0 && (
            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto border-t border-gray-100 pt-2 dark:border-gray-700/50">
              {resultadoImportacion.omitidos.map((o) => (
                <li key={o.fila} className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-danger">Fila {o.fila}:</span> {o.motivo}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium">Servicio <span className="text-danger">*</span></label>
          <Input type="text" value={form.servicio} onChange={setTexto('servicio')} className={`w-full ${marcado('servicio') ? 'border-danger' : ''}`} />
          {marcado('servicio') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Registro <span className="text-danger">*</span></label>
          <Input type="text" value={form.registro} onChange={setTexto('registro')} className={`w-full ${marcado('registro') ? 'border-danger' : ''}`} />
          {marcado('registro') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Fecha y Hora <span className="text-danger">*</span></label>
          <Input type="datetime-local" value={form.fechaHora} onChange={setFecha} className={`w-full ${marcado('fechaHora') ? 'border-danger' : ''}`} />
          {marcado('fechaHora') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Duración <span className="text-danger">*</span></label>
          <Input type="text" placeholder="hh:mm:ss" maxLength={8} value={form.duracion} onChange={setDuracion} className={`w-full ${marcado('duracion') ? 'border-danger' : ''}`} />
          {marcado('duracion') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
        <p className="lg:col-span-6 mt-1 text-xs font-semibold text-gray-500">Extremo A</p>
        <div>
          <label className="mb-1 block text-xs font-medium">Número A <span className="text-danger">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={8} placeholder="8 dígitos" value={form.numeroA} onChange={setNumero('numeroA')} className={`w-full ${marcado('numeroA') ? 'border-danger' : ''}`} />
          {marcado('numeroA') && <span className="mt-1 block text-xs italic text-danger">{MSG_NUMERO}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">IMEI A <span className="text-danger">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={15} placeholder="15 dígitos" value={form.imeiA} onChange={setImei('imeiA')} className={`w-full ${marcado('imeiA') ? 'border-danger' : ''}`} />
          {marcado('imeiA') && <span className="mt-1 block text-xs italic text-danger">{MSG_IMEI}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">RBS A <span className="text-danger">*</span></label>
          <Input type="text" value={form.rbsA} onChange={setTexto('rbsA')} className={`w-full ${marcado('rbsA') ? 'border-danger' : ''}`} />
          {marcado('rbsA') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Celda A <span className="text-danger">*</span></label>
          <Input type="text" value={form.celdaA} onChange={setTexto('celdaA')} className={`w-full ${marcado('celdaA') ? 'border-danger' : ''}`} />
          {marcado('celdaA') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Latitud A <span className="text-danger">*</span></label>
          <Input type="text" inputMode="decimal" placeholder="-16.500000" value={form.latA} onChange={setLatLon('latA')} onBlur={handleLatLonBlur('latA')} className={`w-full ${marcado('latA') ? 'border-danger' : ''}`} />
          {marcado('latA') && <span className="mt-1 block text-xs italic text-danger">{MSG_LATLON}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Longitud A <span className="text-danger">*</span></label>
          <Input type="text" inputMode="decimal" placeholder="-68.150000" value={form.lonA} onChange={setLatLon('lonA')} onBlur={handleLatLonBlur('lonA')} className={`w-full ${marcado('lonA') ? 'border-danger' : ''}`} />
          {marcado('lonA') && <span className="mt-1 block text-xs italic text-danger">{MSG_LATLON}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
        <p className="lg:col-span-6 mt-1 text-xs font-semibold text-gray-500">Extremo B</p>
        <div className="lg:col-span-6">
          <label className="mb-1 block text-xs font-medium">Titular <span className="text-danger">*</span></label>
          <Input type="text" value={form.titular} onChange={setTexto('titular')} className={`w-full ${marcado('titular') ? 'border-danger' : ''}`} />
          {marcado('titular') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Número B <span className="text-danger">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={8} placeholder="8 dígitos" value={form.numeroB} onChange={setNumero('numeroB')} className={`w-full ${marcado('numeroB') ? 'border-danger' : ''}`} />
          {marcado('numeroB') && <span className="mt-1 block text-xs italic text-danger">{MSG_NUMERO}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">IMEI B <span className="text-danger">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={15} placeholder="15 dígitos" value={form.imeiB} onChange={setImei('imeiB')} className={`w-full ${marcado('imeiB') ? 'border-danger' : ''}`} />
          {marcado('imeiB') && <span className="mt-1 block text-xs italic text-danger">{MSG_IMEI}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">RBS B <span className="text-danger">*</span></label>
          <Input type="text" value={form.rbsB} onChange={setTexto('rbsB')} className={`w-full ${marcado('rbsB') ? 'border-danger' : ''}`} />
          {marcado('rbsB') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Celda B <span className="text-danger">*</span></label>
          <Input type="text" value={form.celdaB} onChange={setTexto('celdaB')} className={`w-full ${marcado('celdaB') ? 'border-danger' : ''}`} />
          {marcado('celdaB') && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Latitud B <span className="text-danger">*</span></label>
          <Input type="text" inputMode="decimal" placeholder="-16.510000" value={form.latB} onChange={setLatLon('latB')} onBlur={handleLatLonBlur('latB')} className={`w-full ${marcado('latB') ? 'border-danger' : ''}`} />
          {marcado('latB') && <span className="mt-1 block text-xs italic text-danger">{MSG_LATLON}</span>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Longitud B <span className="text-danger">*</span></label>
          <Input type="text" inputMode="decimal" placeholder="-68.160000" value={form.lonB} onChange={setLatLon('lonB')} onBlur={handleLatLonBlur('lonB')} className={`w-full ${marcado('lonB') ? 'border-danger' : ''}`} />
          {marcado('lonB') && <span className="mt-1 block text-xs italic text-danger">{MSG_LATLON}</span>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar Llamada</Button>
      </div>

      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-4 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin llamadas registradas</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {lista.map((f) => (
            <div
              key={f.idFlujoFiscalia}
              className="relative rounded-lg border border-[#e0e6ed] bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 dark:border-gray-700/50">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                      {f.numeroA}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                      {f.numeroB}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                      {f.duracion}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      className="h-6 w-6 p-0 shrink-0"
                      onClick={() => eliminar(f.idFlujoFiscalia)}
                      title="Eliminar llamada"
                    >
                      <IconTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Grid */}
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[11px]">
                  {/* Extremo A */}
                  <div className="rounded bg-gray-50/50 p-2 dark:bg-gray-900/30">
                    <span className="font-semibold text-primary block mb-0.5 text-[9px] uppercase tracking-wider">Extremo A</span>
                    <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium text-gray-500">IMEI:</span> {f.imeiA}</p>
                      <p><span className="font-medium text-gray-500">RBS:</span> {f.rbsA} <span className="text-gray-300">·</span> <span className="font-medium text-gray-500">Celda:</span> {f.celdaA}</p>
                      <p><span className="font-medium text-gray-500">Coordenadas:</span> {formatDecimal(f.latA, 6)}, {formatDecimal(f.lonA, 6)}</p>
                    </div>
                  </div>

                  {/* Extremo B */}
                  <div className="rounded bg-gray-50/50 p-2 dark:bg-gray-900/30">
                    <span className="font-semibold text-secondary block mb-0.5 text-[9px] uppercase tracking-wider">Extremo B</span>
                    <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium text-gray-500">Titular:</span> <span className="font-medium text-gray-900 dark:text-gray-100">{f.titular}</span></p>
                      <p><span className="font-medium text-gray-500">IMEI:</span> {f.imeiB}</p>
                      <p><span className="font-medium text-gray-500">RBS:</span> {f.rbsB} <span className="text-gray-300">·</span> <span className="font-medium text-gray-500">Celda:</span> {f.celdaB}</p>
                      <p><span className="font-medium text-gray-500">Coordenadas:</span> {formatDecimal(f.latB, 6)}, {formatDecimal(f.lonB, 6)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-500 dark:border-gray-700/50 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dayjs(f.fechaHora).format('DD/MM/YYYY HH:mm:ss')}
                </span>
                <div className="flex gap-2">
                  <span><span className="font-medium">Servicio:</span> {f.servicio}</span>
                  <span className="text-gray-300">|</span>
                  <span><span className="font-medium">Registro:</span> {f.registro}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Panel principal: Flujo Telefónico ─────────────────────────────────────────
export function FlujoTelefonicoPanel({ blanco }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<FlujoTelefonico[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [empresa, setEmpresa] = useState('')
  const [direccion, setDireccion] = useState('')
  const [numero, setNumero] = useState('')
  const [expandidoId, setExpandidoId] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const r = await BlancosService.listarFlujosTelefonicos(blanco.idBlanco)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [blanco.idBlanco])

  useEffect(() => { void cargar() }, [cargar])

  const errorEmpresa = !empresa.trim() && submitted
  const errorDireccion = !direccion.trim() && submitted
  const errorNumero = !numero.trim() && submitted

  const guardar = async () => {
    setSubmitted(true)
    if (!empresa.trim() || !direccion.trim() || !numero.trim()) return
    setCargando(true)
    try {
      const r = await BlancosService.crearFlujoTelefonico(blanco.idBlanco, {
        empresa: empresa.trim(),
        direccion: direccion.trim(),
        numero,
      })
      if (r?.finalizado) {
        setEmpresa(''); setDireccion(''); setNumero(''); setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Flujo telefónico registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (idFlujo: string) => {
    confirm({
      texto: '¿Eliminar este flujo telefónico? También se eliminarán sus llamadas de fiscalía.',
      onConfirm: async () => {
        setCargando(true)
        try {
          await BlancosService.eliminarFlujoTelefonico(idFlujo)
          if (expandidoId === idFlujo) setExpandidoId(null)
          void cargar()
        } finally { setCargando(false) }
      },
    })
  }

  const descargarCsv = async () => {
    setCargando(true)
    try {
      const flujos = lista
      const detalles = await Promise.all(
        flujos.map((f) => BlancosService.listarFlujoFiscalia(f.idFlujo))
      )

      type FilaCsv = {
        empresa: string
        direccion: string
        numero: string
        servicio: string
        registro: string
        numeroA: string
        imeiA: string
        rbsA: string
        celdaA: string
        latA: string
        lonA: string
        numeroB: string
        titular: string
        imeiB: string
        rbsB: string
        celdaB: string
        latB: string
        lonB: string
        fechaHora: string
        duracion: string
      }

      const filas: FilaCsv[] = []
      flujos.forEach((flujo, idx) => {
        const llamadas = detalles[idx]?.datos ?? []
        if (llamadas.length === 0) {
          filas.push({
            empresa: flujo.empresa,
            direccion: flujo.direccion,
            numero: flujo.numero,
            servicio: '', registro: '', numeroA: '', imeiA: '', rbsA: '', celdaA: '',
            latA: '', lonA: '', numeroB: '', titular: '', imeiB: '', rbsB: '', celdaB: '',
            latB: '', lonB: '', fechaHora: '', duracion: '',
          })
          return
        }
        llamadas.forEach((l) => {
          filas.push({
            empresa: flujo.empresa,
            direccion: flujo.direccion,
            numero: flujo.numero,
            servicio: l.servicio,
            registro: l.registro,
            numeroA: l.numeroA,
            imeiA: l.imeiA,
            rbsA: l.rbsA,
            celdaA: l.celdaA,
            latA: formatDecimal(l.latA, 6),
            lonA: formatDecimal(l.lonA, 6),
            numeroB: l.numeroB,
            titular: l.titular,
            imeiB: l.imeiB,
            rbsB: l.rbsB,
            celdaB: l.celdaB,
            latB: formatDecimal(l.latB, 6),
            lonB: formatDecimal(l.lonB, 6),
            fechaHora: l.fechaHora,
            duracion: l.duracion,
          })
        })
      })

      if (filas.length === 0) {
        Alerta({ mensaje: 'No hay datos de flujo telefónico para exportar', variant: 'warning' })
        return
      }

      exportToCSV<FilaCsv>(
        filas,
        [
          'Empresa', 'Dirección', 'Número', 'Servicio', 'Registro',
          'Número A', 'IMEI A', 'RBS A', 'Celda A', 'Latitud A', 'Longitud A',
          'Número B', 'Titular', 'IMEI B', 'RBS B', 'Celda B', 'Latitud B', 'Longitud B',
          'Fecha/Hora', 'Duración',
        ],
        [
          'empresa', 'direccion', 'numero', 'servicio', 'registro',
          'numeroA', 'imeiA', 'rbsA', 'celdaA', 'latA', 'lonA',
          'numeroB', 'titular', 'imeiB', 'rbsB', 'celdaB', 'latB', 'lonB',
          'fechaHora', 'duracion',
        ],
        `flujo-telefonico-${blanco.idBlanco}`
      )
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Empresa <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
            className={`w-full ${errorEmpresa ? 'border-danger' : ''}`}
          />
          {errorEmpresa && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Dirección <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value.toUpperCase())}
            className={`w-full ${errorDireccion ? 'border-danger' : ''}`}
          />
          {errorDireccion && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Número <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className={`w-full ${errorNumero ? 'border-danger' : ''}`}
          />
          {errorNumero && <span className="mt-1 block text-xs italic text-danger">Este campo es obligatorio</span>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline-primary" size="sm" onClick={() => void descargarCsv()} disabled={cargando || lista.length === 0}>
          <IconDownload className="mr-1 h-4 w-4" />
          Descargar CSV
        </Button>
        <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>
          Guardar
        </Button>
      </div>

      {lista.length === 0 ? (
        <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
          <span className="text-xs text-gray-400">Sin flujos telefónicos registrados</span>
        </div>
      ) : (
        <ul className="divide-y divide-[#e0e6ed] dark:divide-gray-700">
          {lista.map((f) => {
            const expandido = expandidoId === f.idFlujo
            return (
              <li key={f.idFlujo} className="py-2">
                <div
                  className="flex cursor-pointer items-start justify-between gap-2"
                  onClick={() => setExpandidoId(expandido ? null : f.idFlujo)}
                >
                  <div className="flex items-start gap-2 text-sm">
                    <IconCaretDown className={`mt-0.5 h-3 w-3 shrink-0 transition-transform ${expandido ? 'rotate-180' : ''}`} />
                    <div>
                      <span className="font-medium">{f.empresa}</span>
                      <span className="ml-2 text-xs text-gray-500">{f.numero} · {f.direccion}</span>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="shrink-0"
                    onClick={(e) => { e.stopPropagation(); eliminar(f.idFlujo) }}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
                {expandido && <PanelFlujoFiscalia idFlujo={f.idFlujo} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
