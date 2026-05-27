'use client'
import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import type { VehiculoS2i } from '@/services/analisis'
import { VehiculoS2iService } from '@/services/analisis/vehiculo.service'

interface Props {
  idCaso: string
}

const ITEMS_POR_PAGINA = 10

export function SeccionVehiculos({ idCaso }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [lista, setLista] = useState<VehiculoS2i[]>([])
  const [submitted, setSubmitted] = useState(false)

  const [propietario, setPropietario] = useState('')
  const [placa, setPlaca] = useState('')
  const [color, setColor] = useState('')
  const [marca, setMarca] = useState('')

  const cargar = useCallback(async () => {
    if (!idCaso) return
    setCargando(true)
    try {
      const r = await VehiculoS2iService.listarVehiculos(idCaso)
      if (r?.finalizado) setLista(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idCaso])

  useEffect(() => { void cargar() }, [cargar])

  const limpiar = () => {
    setPropietario(''); setPlaca(''); setColor(''); setMarca(''); setSubmitted(false)
  }

  const guardar = async () => {
    setSubmitted(true)
    if (!propietario.trim() || !placa.trim() || !color.trim() || !marca.trim()) return
    setCargando(true)
    try {
      const r = await VehiculoS2iService.crearVehiculo(idCaso, {
        propietario: propietario.trim(),
        placa: placa.trim(),
        color: color.trim(),
        marca: marca.trim(),
      })
      if (r?.finalizado) {
        limpiar()
        void cargar()
        Alerta({ mensaje: 'Vehículo registrado', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (v: VehiculoS2i) => {
    confirm({
      texto: `¿Eliminar el vehículo con placa ${v.placa}?`,
      onConfirm: async () => {
        setCargando(true)
        try { await VehiculoS2iService.eliminarVehiculo(v.idVehiculo); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v.trim() && submitted

  const columns: Column<VehiculoS2i>[] = [
    { accessor: 'placa', title: 'Placa' },
    { accessor: 'marca', title: 'Marca' },
    { accessor: 'color', title: 'Color' },
    { accessor: 'propietario', title: 'Propietario' },
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
      <h4 className="mb-4 text-sm font-semibold">Vehículos</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Propietario <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={propietario}
            onChange={(e) => setPropietario(e.target.value.toUpperCase())}
            className={`w-full ${req(propietario) ? 'border-danger' : ''}`}
          />
          {req(propietario) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Placa <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
            className={`w-full ${req(placa) ? 'border-danger' : ''}`}
            placeholder="1234ABC"
          />
          {req(placa) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Color <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            className={`w-full ${req(color) ? 'border-danger' : ''}`}
          />
          {req(color) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Marca <span className="text-danger">*</span></label>
          <Input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value.toUpperCase())}
            className={`w-full ${req(marca) ? 'border-danger' : ''}`}
          />
          {req(marca) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="flex items-end">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando} className="w-full">
            Guardar
          </Button>
        </div>
      </div>

      <div className="mt-5 datatables">
        <VristoDataTable<VehiculoS2i>
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
