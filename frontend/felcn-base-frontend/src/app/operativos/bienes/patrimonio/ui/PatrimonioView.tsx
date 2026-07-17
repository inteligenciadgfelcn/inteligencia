'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BackButton } from '@/components/ui/BackButton'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { useAlerts } from '@/hooks/useAlerts'
import { useConfirmDialog } from '@/hooks'
import {
  BienesService,
  PatrimonioService,
  type BienResponse,
  type PatrimonioResponse,
  type OperativoResponse,
} from '@/services/operativos'

// ─── Tarjeta de resumen ───────────────────────────────────────────────────────
function TarjetaResumen({
  label,
  valor,
  moneda,
  destacado = false,
}: {
  label: string
  valor: number | null
  moneda: string
  destacado?: boolean
}) {
  const formateado =
    valor !== null
      ? valor.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '—'

  return (
    <div
      className={`rounded-lg border p-4 ${destacado
        ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
        : 'border-[#e0e6ed] dark:border-[#1b2e4b]'
        }`}
    >
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${destacado ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
        {moneda} {formateado}
      </p>
    </div>
  )
}

// ─── Fila de dato del operativo ───────────────────────────────────────────────
function FilaDato({ label, valor }: { label: string; valor?: string | number | null }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-[#e0e6ed] dark:border-[#1b2e4b] last:border-0">
      <span className="w-44 shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs text-gray-800 dark:text-white">{valor ?? '—'}</span>
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PatrimonioViewProps {
  idOperativo?: string
}

const ITEMS_POR_PAGINA = 10

// ─── PatrimonioView ───────────────────────────────────────────────────────────
export function PatrimonioView({ idOperativo }: PatrimonioViewProps) {
  const router = useRouter()
  const { Alerta } = useAlerts()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const idOp = Number(idOperativo ?? 0)
  const idValido = idOp > 0

  // ── Estado general ────────────────────────────────────────────────────────
  const [cargando, setCargando] = useState(false)

  // ── Cabecera del operativo ────────────────────────────────────────────────
  const [operativo, setOperativo] = useState<OperativoResponse | null>(null)

  const cargarOperativo = useCallback(async () => {
    if (!idValido) return
    try {
      const res = await PatrimonioService.obtenerOperativo(idOp)
      if (res?.finalizado) setOperativo(res.datos ?? null)
    } catch {
      setOperativo(null)
    }
  }, [idOp, idValido])

  // ── Lista de bienes ───────────────────────────────────────────────────────
  const [bienes, setBienes] = useState<BienResponse[]>([])
  const [totalBienes, setTotalBienes] = useState(0)
  const [pagina, setPagina] = useState(1)

  const cargarBienes = useCallback(
    async (pag: number = 1) => {
      if (!idValido) return
      setCargando(true)
      try {
        const res = await BienesService.listar(idOp, pag, ITEMS_POR_PAGINA)
        if (res?.finalizado) {
          setBienes(res.datos?.filas ?? [])
          setTotalBienes(res.datos?.page?.totalElements ?? 0)
        }
      } finally {
        setCargando(false)
      }
    },
    [idOp, idValido]
  )

  // ── Bien seleccionado para editar costos ──────────────────────────────────
  const [bienSeleccionado, setBienSeleccionado] = useState<BienResponse | null>(null)
  const [costoAproximado, setCostoAproximado] = useState('')
  const [costoCuantificado, setCostoCuantificado] = useState('')
  const [cargandoCostos, setCargandoCostos] = useState(false)

  const seleccionarBien = (bien: BienResponse) => {
    setBienSeleccionado(bien)
    setCostoAproximado(String(bien.costoAproximado ?? 0))
    setCostoCuantificado(String(bien.costoCuantificado ?? 0))
  }

  const limpiarSeleccion = () => {
    setBienSeleccionado(null)
    setCostoAproximado('')
    setCostoCuantificado('')
  }

  // Actualizar costos — Button2_Click de ABM-ING-COSTO
  const actualizarCostos = async () => {
    if (!bienSeleccionado) return
    const aprox = parseFloat(costoAproximado || '0')
    const cuant = parseFloat(costoCuantificado || '0')
    if (aprox < 0 || cuant < 0) {
      Alerta({ mensaje: 'Los costos no pueden ser negativos', variant: 'error' })
      return
    }
    confirm({
      texto: '¿Actualizar los costos de este bien?',
      onConfirm: async () => {
        setCargandoCostos(true)
        try {
          const res = await PatrimonioService.actualizarCostos(idOp, Number(bienSeleccionado.id), {
            costoAproximado: aprox,
            costoCuantificado: cuant,
          })
          if (res?.finalizado) {
            Alerta({ mensaje: 'Costos actualizados correctamente', variant: 'success' })
            limpiarSeleccion()
            await cargarBienes(pagina)
            // Recalcular patrimonio automáticamente con el mismo tipo de cambio
            await recalcularPatrimonio()
          }
        } finally {
          setCargandoCostos(false)
        }
      },
    })
  }

  // ── Patrimonio total ──────────────────────────────────────────────────────
  const [tipoCambio, setTipoCambio] = useState('6.92')
  const [patrimonio, setPatrimonio] = useState<PatrimonioResponse | null>(null)
  const [cargandoPatrimonio, setCargandoPatrimonio] = useState(false)

  // Calcular / Recalcular — calcula() de ABM-ING-COSTO
  const recalcularPatrimonio = useCallback(async () => {
    if (!idValido) return
    const cambio = parseFloat(tipoCambio || '6.92')
    if (isNaN(cambio) || cambio <= 0) {
      Alerta({ mensaje: 'El tipo de cambio debe ser mayor a 0', variant: 'error' })
      return
    }
    setCargandoPatrimonio(true)
    try {
      const res = await PatrimonioService.calcularPatrimonio(idOp, cambio)
      if (res?.finalizado) setPatrimonio(res.datos ?? null)
    } finally {
      setCargandoPatrimonio(false)
    }
  }, [idOp, idValido, tipoCambio]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!idValido) return
    void cargarOperativo()
    void cargarBienes(1)
    void recalcularPatrimonio()
  }, [idOp]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pantalla de error si no hay idOperativo ───────────────────────────────
  if (!idValido) {
    return (
      <div className="panel flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-gray-500">No se especificó un operativo válido.</p>
        <Button variant="outline-primary" size="sm" onClick={() => router.push('/patrimonio')}>
          Volver a Búsqueda
        </Button>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <LoadingDialog show={cargando || cargandoCostos} />
      <ConfirmDialog />

      {/* ── Barra superior ── */}
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h2 className="text-lg font-semibold">Patrimonio Bienes</h2>
        </div>
        <Button variant="outline-primary" size="sm" onClick={() => router.push('/patrimonio')}>
          Volver a Búsqueda
        </Button>
      </div>

      {/* ── DATOS GENERALES DEL CASO ── */}
      <div className="panel">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Datos Generales del Caso
        </h3>
        <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
          <div>
            <FilaDato label="Id Operativo" valor={operativo?.id} />
            <FilaDato label="Nro. Radiograma / Informe" valor={operativo?.numeroInforme} />
            <FilaDato
              label="Fecha y Hora del Operativo"
              valor={
                operativo?.fechaOperativo
                  ? new Date(operativo.fechaOperativo).toLocaleString('es-BO')
                  : null
              }
            />
            <FilaDato label="Lugar de Operativo" valor={operativo?.lugar} />
          </div>
          <div>
            <FilaDato label="Unidad Ejecutora" valor={(operativo as any)?.descripcionUnidad} />
            <FilaDato label="Tipo de Operativo" valor={(operativo as any)?.descripcionTipoOperativo} />
            <FilaDato label="Plan de Operaciones" valor={(operativo as any)?.descripcionPlanOperaciones} />
            <FilaDato label="Breve Detalle" valor={operativo?.breveDetalle} />
          </div>
        </div>
      </div>

      {/* ── PATRIMONIO BIENES ── */}
      <div className="panel">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Patrimonio Bienes
        </h3>

        {/* Tabla de bienes */}
        <div className="datatables">
          <VristoDataTable
            loading={cargando}
            rows={bienes}
            total={totalBienes}
            limit={ITEMS_POR_PAGINA}
            page={pagina}
            onPageChange={(p) => {
              setPagina(p)
              void cargarBienes(p)
            }}
            onLimitChange={() => { }}
            columns={[
              { accessor: 'descripcionBien', title: 'Bien' },
              { accessor: 'descripcionCatalogoClase', title: 'Clase' },
              { accessor: 'descripcionCatalogoTipo', title: 'Tipo' },
              { accessor: 'cantidadBien', title: 'Cantidad' },
              {
                accessor: 'costoAproximado',
                title: 'Costo Aprox. ($us)',
                render: (r: BienResponse) =>
                  r.costoAproximado != null
                    ? r.costoAproximado.toLocaleString('es-BO', { minimumFractionDigits: 2 })
                    : '—',
              },
              {
                accessor: 'acciones',
                title: 'Seleccionar',
                render: (r: BienResponse) => (
                  <Button
                    type="button"
                    variant={bienSeleccionado?.id === r.id ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => {
                      if (bienSeleccionado?.id === r.id) {
                        limpiarSeleccion()
                      } else {
                        seleccionarBien(r)
                      }
                    }}
                  >
                    {bienSeleccionado?.id === r.id ? 'Seleccionado' : 'Seleccionar'}
                  </Button>
                ),
              },
            ]}
          />
        </div>

        {/* Panel de edición de costos — se activa al seleccionar un bien */}
        {bienSeleccionado && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Editar Costos — {bienSeleccionado.descripcionBien}
              </p>
              <button
                type="button"
                className="text-xs text-gray-400 hover:text-gray-600"
                onClick={limpiarSeleccion}
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Costo Aproximado ($us)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={costoAproximado}
                  onChange={(e) => setCostoAproximado(e.target.value)}
                  className="w-full"
                  disabled={cargandoCostos}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => void actualizarCostos()}
                disabled={cargandoCostos}
              >
                Actualizar Costos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── PATRIMONIO TOTAL AFECTADO ── */}
      <div className="panel">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
          Total Patrimonio Afectado
        </h3>

        {/* Tipo de cambio + recalcular */}
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tipo de Cambio (Bs/$us)
            </label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={tipoCambio}
              onChange={(e) => setTipoCambio(e.target.value)}
              className="w-36"
              disabled={cargandoPatrimonio}
            />
          </div>
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            onClick={() => void recalcularPatrimonio()}
            disabled={cargandoPatrimonio}
          >
            {cargandoPatrimonio ? 'Calculando...' : 'Recalcular'}
          </Button>
        </div>

        {/* Tarjetas de resultado */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Bienes Registrados</p>
            <p className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
              {patrimonio?.cantidadBienes ?? '—'}
            </p>
          </div>
          <TarjetaResumen
            label="Patrimonio Total Afectado ($us)"
            valor={patrimonio?.totalDolares ?? null}
            moneda="$us"
          />
          <TarjetaResumen
            label="Patrimonio Total Afectado (Bs.)"
            valor={patrimonio?.totalBolivianos ?? null}
            moneda="Bs."
            destacado
          />
        </div>
      </div>
    </div>
  )
}
