'use client'
import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import IconTrash from '@/components/Icon/IconTrash'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { SIGPanel } from '@/app/analisis/ui/SigPanel'
import { ArchivosPanel } from '@/app/analisis/ui/ArchivosPanel'
import { OrganizacionesService, S2iLookupsService } from '@/services/analisis'
import type { EmpresaS2i, LookupSimple } from '@/services/analisis'

type Opcion = { value: string; label: string }

const toOpciones = (list: LookupSimple[]): Opcion[] =>
  list.map((o) => ({ value: String(o.id), label: o.descripcion }))

interface Props {
  idCaso: string
}

const TABS_ORG = ['SIG', 'Archivos'] as const
type TabOrg = typeof TABS_ORG[number]

function OrgExpansion({ empresa, opcionesContenido }: { empresa: EmpresaS2i; opcionesContenido: LookupSimple[] }) {
  const [tab, setTab] = useState<TabOrg>('SIG')

  const SIGService = {
    crearLugar: (id: string, p: Parameters<typeof OrganizacionesService.crearLugar>[1]) => OrganizacionesService.crearLugar(id, p),
    listarLugares: (id: string) => OrganizacionesService.listarLugares(id),
    eliminarLugar: (id: string) => OrganizacionesService.eliminarLugar(id),
  }

  const archivosService = {
    subirArchivo: (id: string, p: Parameters<typeof OrganizacionesService.subirArchivo>[1], f: File) =>
      OrganizacionesService.subirArchivo(id, p, f),
    listarArchivos: (id: string) => OrganizacionesService.listarArchivos(id),
    descargarArchivo: (id: string) => OrganizacionesService.descargarArchivo(id),
    eliminarArchivo: (id: string) => OrganizacionesService.eliminarArchivo(id),
  }

  return (
    <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
      <div className="mb-4 flex gap-2 border-b border-[#e0e6ed] dark:border-gray-700">
        {TABS_ORG.map((t) => {
          const activa = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`-mb-px flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${activa
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
                }`}
            >
              {t}
            </button>
          )
        })}
      </div>
      {tab === 'SIG' && <SIGPanel idEntidad={empresa.idEmpresa} service={SIGService} idField="idLugarEmpresa" />}
      {tab === 'Archivos' && (
        <ArchivosPanel idEntidad={empresa.idEmpresa} service={archivosService} idField="idArchivo" opcionesContenido={opcionesContenido} />
      )}
    </div>
  )
}

const ITEMS_POR_PAGINA = 10

export function SeccionOrganizaciones({ idCaso }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [cargando, setCargando] = useState(false)
  const [empresas, setEmpresas] = useState<EmpresaS2i[]>([])
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])
  const [submitted, setSubmitted] = useState(false)

  const [opcionesTipoOrg, setOpcionesTipoOrg] = useState<Opcion[]>([])
  const [opcionesContenido, setOpcionesContenido] = useState<LookupSimple[]>([])

  const [idTipoOrganizacion, setIdTipoOrganizacion] = useState('')
  const [nombre, setNombre] = useState('')
  const [nit, setNit] = useState('')
  const [matricula, setMatricula] = useState('')
  const [representante, setRepresentante] = useState('')
  const [observaciones, setObservaciones] = useState('')

  useEffect(() => {
    Promise.all([
      S2iLookupsService.listarTiposOrganizacion(),
      S2iLookupsService.listarContenidoCaso(),
    ]).then(([rT, rC]) => {
      if (rT?.finalizado) setOpcionesTipoOrg(toOpciones(rT.datos ?? []))
      if (rC?.finalizado) setOpcionesContenido(rC.datos ?? [])
    }).catch(() => { })
  }, [])

  const cargar = useCallback(async () => {
    if (!idCaso) return
    setCargando(true)
    try {
      const r = await OrganizacionesService.listar(idCaso)
      if (r?.finalizado) setEmpresas(r.datos ?? [])
    } finally { setCargando(false) }
  }, [idCaso])

  useEffect(() => { void cargar() }, [cargar])

  const guardar = async () => {
    setSubmitted(true)
    if (!idTipoOrganizacion || !nombre.trim()) return
    setCargando(true)
    try {
      const r = await OrganizacionesService.crear(idCaso, {
        idTipoOrganizacion: Number(idTipoOrganizacion),
        nombre: nombre.trim().toUpperCase(),
        nit: nit.trim().toUpperCase() || undefined,
        matricula: matricula.trim().toUpperCase() || undefined,
        representante: representante.trim().toUpperCase() || undefined,
        observaciones: observaciones.trim().toUpperCase() || undefined,
      })
      if (r?.finalizado) {
        setIdTipoOrganizacion(''); setNombre(''); setNit(''); setMatricula(''); setRepresentante(''); setObservaciones('')
        setSubmitted(false)
        void cargar()
        Alerta({ mensaje: 'Organización reSIGtrada', variant: 'success' })
      }
    } catch (e) { Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' }) }
    finally { setCargando(false) }
  }

  const eliminar = (e: EmpresaS2i) => {
    confirm({
      texto: `¿Eliminar la organización "${e.nombre}"?`,
      onConfirm: async () => {
        setCargando(true)
        try { await OrganizacionesService.eliminar(e.idEmpresa); void cargar() }
        finally { setCargando(false) }
      },
    })
  }

  const req = (v: string) => !v && submitted

  const columns: Column<EmpresaS2i>[] = [
    { accessor: 'descripcionTipoOrganizacion', title: 'Tipo' },
    { accessor: 'nombre', title: 'Nombre' },
    { accessor: 'nit', title: 'NIT' },
    { accessor: 'matricula', title: 'Matrícula' },
    { accessor: 'representante', title: 'Representante' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (r) => (
        <button type="button" className="text-danger hover:text-danger/80" onClick={(e) => { e.stopPropagation(); eliminar(r) }}>
          <IconTrash className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <h4 className="mb-4 text-sm font-semibold">Organizaciones / Empresas</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tipo de Organización <span className="text-danger">*</span></label>
          <Select value={idTipoOrganizacion} onChange={(e) => setIdTipoOrganizacion(e.target.value)} options={opcionesTipoOrg} placeholder="Seleccione..." className={`w-full ${req(idTipoOrganizacion) ? 'border-danger' : ''}`} />
          {req(idTipoOrganizacion) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nombre / Razón Social <span className="text-danger">*</span></label>
          <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} className={`w-full ${req(nombre.trim()) ? 'border-danger' : ''}`} />
          {req(nombre.trim()) && <span className="mt-1 block text-xs italic text-danger">Obligatorio</span>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">NIT</label>
          <Input type="text" value={nit} onChange={(e) => setNit(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Matrícula</label>
          <Input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Representante Legal</label>
          <Input type="text" value={representante} onChange={(e) => setRepresentante(e.target.value.toUpperCase())} className="w-full" />
        </div>
        <div className="lg:col-span-4">
          <label className="mb-1 block text-sm font-medium">Observaciones</label>
          <Textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full" />
        </div>
        <div className="lg:col-span-4 flex justify-end mt-2">
          <Button variant="success" size="sm" onClick={() => void guardar()} disabled={cargando}>Guardar</Button>
        </div>
      </div>

      <div className="mt-5 datatables">
        <VristoDataTable<EmpresaS2i>
          loading={cargando}
          rows={empresas}
          total={empresas.length}
          limit={ITEMS_POR_PAGINA}
          page={1}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={columns}
          rowExpansion={{
            idField: 'idEmpresa',
            expandedIds,
            onExpandChange: setExpandedIds,
            renderContent: (e) => <OrgExpansion empresa={e} opcionesContenido={opcionesContenido} />,
          }}
        />
      </div>
    </div>
  )
}
