'use client'
import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { TelefoniaS2iService } from '@/services/analisis'
import type { TelefonoS2i } from '@/services/analisis'

interface Props {
  idCaso: string
}

const ITEMS_POR_PAGINA = 10

export function SeccionTelefonos({ idCaso }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<TelefonoS2i[]>([])
  const [submitted, setSubmitted] = useState(false)

  const [numero1, setNumero1] = useState('')
  const [propietario1, setPropietario1] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [numero2, setNumero2] = useState('')
  const [propietario2, setPropietario2] = useState('')

  const cargar = useCallback(async () => {
    if (!idCaso) return
    setCargando(true)
    try {
      const r = await TelefoniaS2iService.listarTelefonos(idCaso)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idCaso])

  useEffect(() => { void cargar() }, [cargar])

  const limpiar = () => {
    setNumero1(''); setPropietario1(''); setMensaje('')
    setNumero2(''); setPropietario2(''); setSubmitted(false)
  }

  const guardar = async () => {
    setSubmitted(true)
    if (!numero1.trim() || !propietario1.trim() || !mensaje.trim() || !numero2.trim() || !propietario2.trim()) return
    setCargando(true)
    try {
      const r = await TelefoniaS2iService.crearTelefono(idCaso, {
        numero1: numero1.trim(),
        propietario1: propietario1.trim(),
        mensaje: mensaje.trim(),
        numero2: numero2.trim(),
        propietario2: propietario2.trim(),
      })
      if (r?.finalizado) {
        limpiar()
        void cargar()
        Alerta({ mensaje: 'Teléfono registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (t: TelefonoS2i) => {
    confirm({
      texto: `¿Eliminar el registro del número ${t.numero1}?`,
      onConfirm: async () => {
        setCargando(true)
        try { await TelefoniaS2iService.eliminarTelefono(t.idTelefono); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v.trim() && submitted

  const columns: Column<TelefonoS2i>[] = [
    { accessor: 'numero1', title: 'Número 1' },
    { accessor: 'propietario1', title: 'Propietario 1' },
    { accessor: 'numero2', title: 'Número 2' },
    { accessor: 'propietario2', title: 'Propietario 2' },
    {
      accessor: 'mensaje',
      title: 'Mensaje',
      render: (r) => (
        <span className="block max-w-xs truncate text-xs text-gray-500" title={r.mensaje}>
          {r.mensaje}
        </span>
      ),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (r) => (
        <button
          type="button"
          className="text-danger hover:text-danger/80"
          onClick={() => eliminar(r)}
        >
          <IconTrash className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <h4 className="mb-4 text-sm font-semibold">Telefonía</h4>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Número 1 <span className="text-danger">*</span></label>
            <Input
              type="text"
              value={numero1}
              onChange={(e) => setNumero1(e.target.value)}
              className={`w-full ${req(numero1) ? 'border-danger' : ''}`}
              placeholder="77712345"
            />
            {req(numero1) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Propietario 1 <span className="text-danger">*</span></label>
            <Input
              type="text"
              value={propietario1}
              onChange={(e) => setPropietario1(e.target.value.toUpperCase())}
              className={`w-full ${req(propietario1) ? 'border-danger' : ''}`}
            />
            {req(propietario1) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Número 2 <span className="text-danger">*</span></label>
            <Input
              type="text"
              value={numero2}
              onChange={(e) => setNumero2(e.target.value)}
              className={`w-full ${req(numero2) ? 'border-danger' : ''}`}
              placeholder="71154321"
            />
            {req(numero2) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Propietario 2 <span className="text-danger">*</span></label>
            <Input
              type="text"
              value={propietario2}
              onChange={(e) => setPropietario2(e.target.value.toUpperCase())}
              className={`w-full ${req(propietario2) ? 'border-danger' : ''}`}
            />
            {req(propietario2) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <label className="mb-1 block text-sm font-medium">Mensaje / Transcripción <span className="text-danger">*</span></label>
            <Textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              uppercase
              className={`w-full ${req(mensaje) ? 'border-danger' : ''}`}
            />
            {req(mensaje) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
          </div>
          <div className="flex items-end">
            <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando} className="w-full">
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5 datatables">
        <VristoDataTable<TelefonoS2i>
          loading={cargando}
          rows={lista}
          total={lista.length}
          limit={ITEMS_POR_PAGINA}
          page={1}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={columns}
        />
      </div>
    </div>
  )
}
