'use client'

import { useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import type { Map as LeafletMap } from 'leaflet'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconPlus from '@/components/Icon/IconPlus'
import IconEye from '@/components/Icon/IconEye'
import IconTrash from '@/components/Icon/IconTrash'

import { BienesApi } from '../api/bienes.api'
import { ActuacionesApi } from '../api/actuaciones.api'
import type { ActuacionRow } from '../types/actuaciones.types'
import type {
  BienCatalogo,
  BienSecuestradoRow,
  CalidadBien,
  CaracteristicaCatalogo,
  ClaseBien,
  TipoBien,
  TipoSituacionBien,
  TipoVinculo,
  Vinculo,
} from '../types/bienes.types'
import { VALORES_POR_DEFECTO } from '../types/bienes.types'
import { formatFecha } from '../../utils/fechas'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  { ssr: false }
)

type Props = {
  casoId: number
}

function formatMoney(valor: number): string {
  return valor.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type FormState = typeof VALORES_POR_DEFECTO

export function BienesIdentificados({ casoId }: Props) {
  const [vista, setVista] = useState<'lista' | 'formulario'>('lista')
  const [bienDetalle, setBienDetalle] = useState<BienSecuestradoRow | null>(null)
  const [bienEliminar, setBienEliminar] = useState<BienSecuestradoRow | null>(null)
  const [mapaOpen, setMapaOpen] = useState(false)
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const [opId, setOpId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [form, setForm] = useState<FormState>({ ...VALORES_POR_DEFECTO })

  const mapRef = useRef<LeafletMap | null>(null)

  const [actuaciones, setActuaciones] = useState<ActuacionRow[]>([])

  useEffect(() => {
    let activo = true
    ActuacionesApi.listarActuaciones(casoId, { pagina: 1, limite: 50 })
      .then((res) => {
        if (activo) setActuaciones(res.filas ?? [])
      })
      .catch(() => undefined)
    return () => {
      activo = false
    }
  }, [casoId])

  const { data: bienesData, isLoading: bienesLoading } = useQuery({
    queryKey: ['lgi-bienes', opId, page, limit],
    enabled: Boolean(opId),
    queryFn: () =>
      BienesApi.listarPorOperativo(opId!, {
        pagina: page,
        limite: limit,
      }),
  })

  const { data: bienesCatalogo = [] } = useQuery<BienCatalogo[]>({
    queryKey: ['lgi-bienes', 'catalogo-bienes'],
    queryFn: () => BienesApi.listarBienes(),
  })
  const { data: vinculos = [] } = useQuery<Vinculo[]>({
    queryKey: ['lgi-bienes', 'vinculos'],
    queryFn: () => BienesApi.listarVinculos(),
  })
  const { data: tiposSituacion = [] } = useQuery<TipoSituacionBien[]>({
    queryKey: ['lgi-bienes', 'tipos-situacion'],
    queryFn: () => BienesApi.listarTiposSituacionBien(),
  })
  const { data: calidades = [] } = useQuery<CalidadBien[]>({
    queryKey: ['lgi-bienes', 'calidades'],
    queryFn: () => BienesApi.listarSituacionesLegalesBien(),
  })

  const { data: clases = [] } = useQuery<ClaseBien[]>({
    queryKey: ['lgi-bienes', 'clases', form.bienId],
    enabled: Boolean(form.bienId),
    queryFn: () => BienesApi.listarClasesBien(form.bienId),
  })
  const { data: tipos = [] } = useQuery<TipoBien[]>({
    queryKey: ['lgi-bienes', 'tipos', form.claseId],
    enabled: Boolean(form.claseId),
    queryFn: () => BienesApi.listarTiposClase(form.claseId),
  })
  const { data: caracteristicasCatalogo = [] } =
    useQuery<CaracteristicaCatalogo[]>({
      queryKey: ['lgi-bienes', 'caracteristicas', form.claseId],
      enabled: Boolean(form.claseId),
      queryFn: () => BienesApi.listarCaracteristicasClase(form.claseId),
    })
  const { data: tiposVinculo = [] } = useQuery<TipoVinculo[]>({
    queryKey: ['lgi-bienes', 'tipos-vinculo', form.idVinculo],
    enabled: Boolean(form.idVinculo),
    queryFn: () => BienesApi.listarTiposVinculo(form.idVinculo),
  })

  useEffect(() => {
    if (coordenadas) {
      setForm((prev) => ({
        ...prev,
        latitud: coordenadas[0],
        longitud: coordenadas[1],
      }))
    }
  }, [coordenadas])

  const setField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const abrirCrear = () => {
    setForm({ ...VALORES_POR_DEFECTO })
    setCoordenadas(null)
    setMensaje(null)
    setVista('formulario')
  }

  const abrirMapa = () => {
    setMapaOpen(true)
  }

  const confirmarMapa = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      setCoordenadas([center.lat, center.lng])
    }
    setMapaOpen(false)
  }

  const handleMapClick = (center: [number, number]) => {
    setCoordenadas(center)
  }

  const agregarCaracteristica = () => {
    const usados = form.caracteristicas.map((c) => c.catcaracId)
    const disponible = caracteristicasCatalogo.find(
      (c) => !usados.includes(c.catcaracId)
    )
    setForm((prev) => ({
      ...prev,
      caracteristicas: [
        ...prev.caracteristicas,
        {
          catcaracId: disponible?.catcaracId ?? 0,
          descripcion: '',
        },
      ],
    }))
  }

  const actualizarCaracteristica = (
    index: number,
    campo: 'catcaracId' | 'descripcion',
    valor: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((c, i) =>
        i === index ? { ...c, [campo]: valor } : c
      ),
    }))
  }

  const eliminarCaracteristica = (index: number) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index),
    }))
  }

  const agregarFotografias = (files: FileList | null) => {
    if (!files) return
    const nuevos = Array.from(files)
    setForm((prev) => ({
      ...prev,
      fotografias: [...prev.fotografias, ...nuevos].slice(0, 20),
    }))
  }

  const quitarFotografia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      fotografias: prev.fotografias.filter((_, i) => i !== index),
    }))
  }

  const situacionValida = () => {
    const tipo = form.idTipoSituacionLegalBien
    if (tipo === 1) return Boolean(form.fechaActaSecuestro)
    if (tipo === 2) return Boolean(form.fechaResolucion)
    if (tipo === 3) return Boolean(form.fechaSenjud)
    if (tipo === 4 || tipo === 5)
      return Boolean(
        form.fechaRequerimiento &&
          form.responsableEntrega &&
          form.responsableRecepcion &&
          form.institucion
      )
    return false
  }

  const isFormValid =
    Boolean(opId) &&
    form.bienId > 0 &&
    form.claseId > 0 &&
    form.tipoId > 0 &&
    form.direccion.trim() !== '' &&
    form.latitud != null &&
    form.longitud != null &&
    form.idVinculo > 0 &&
    form.idTipoVinculo > 0 &&
    form.nombreCompletoVinculo.trim() !== '' &&
    form.cedulaIdentidadVinculo.trim() !== '' &&
    form.costoAprox >= 0 &&
    form.idTipoSituacionLegalBien > 0 &&
    situacionValida() &&
    (!form.pericia || form.resultadoPericia.trim() !== '') &&
    form.caracteristicas.every(
      (c) => c.catcaracId > 0 && c.descripcion.trim() !== ''
    )

  const construirDatosSituacion = () => {
    const tipo = form.idTipoSituacionLegalBien
    if (tipo === 1) {
      return {
        fiscal: form.fiscal || null,
        fechaActaSecuestro: form.fechaActaSecuestro,
        investigador: form.investigador || null,
      }
    }
    if (tipo === 2) {
      return {
        nroResol: form.nroResol || null,
        fechaResolucion: form.fechaResolucion,
        autoridad: form.autoridad || null,
      }
    }
    if (tipo === 3) {
      return {
        numSentJud: form.numSentJud || null,
        fechaSenjud: form.fechaSenjud,
        autoridad: form.autoridad || null,
      }
    }
    return {
      fechaRequerimiento: form.fechaRequerimiento,
      fiscalRequirente: form.fiscalRequirente || null,
      calbId: form.calbId || null,
      fechaEntrega: form.fechaEntrega || null,
      responsableEntrega: form.responsableEntrega,
      responsableRecepcion: form.responsableRecepcion,
      institucion: form.institucion,
      ubicacion: form.ubicacion || null,
    }
  }

  const onSubmit = async () => {
    if (!isFormValid || !opId) return
    setGuardando(true)
    setMensaje(null)
    try {
      const fd = new FormData()
      fd.append('opId', String(opId))
      fd.append('cattipoId', String(form.tipoId))
      fd.append('costoAprox', String(form.costoAprox))
      if (form.costoCuant > 0) fd.append('costoCuant', String(form.costoCuant))
      if (form.latitud != null) fd.append('latitud', String(form.latitud))
      if (form.longitud != null) fd.append('longitud', String(form.longitud))
      fd.append('lugarSecuestro', form.direccion)
      fd.append('idTipoVinculo', String(form.idTipoVinculo))
      fd.append('nombreCompletoVinculo', form.nombreCompletoVinculo)
      fd.append('cedulaIdentidadVinculo', form.cedulaIdentidadVinculo)
      fd.append('pericia', String(form.pericia))
      if (form.resultadoPericia) fd.append('resultadoPericia', form.resultadoPericia)
      if (form.nombreDepositario) fd.append('nombreDepositario', form.nombreDepositario)
      if (form.ciDepositario) fd.append('ciDepositario', form.ciDepositario)
      form.fotografias.forEach((foto) => fd.append('fotografias', foto))

      const bien = await BienesApi.crearBien(fd)
      const itembiensecId = Number(
        bien?.itembiensecId ?? (bien as Record<string, unknown>)?.casosId
      )

      await BienesApi.registrarSituacionJuridica({
        itembiensecId,
        idTipoSituacionLegalBien: form.idTipoSituacionLegalBien,
        datos: construirDatosSituacion(),
      })

      for (const caracteristica of form.caracteristicas) {
        await BienesApi.registrarCaracteristica({
          itembiensecId,
          catcaracId: caracteristica.catcaracId,
          descripcion: caracteristica.descripcion,
        })
      }

      setVista('lista')
      setMensaje('Bien registrado correctamente')
      setPage(1)
    } catch {
      setMensaje('Error al registrar el bien. Intente nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminar = async () => {
    if (!bienEliminar) return
    try {
      await BienesApi.eliminarBien(Number(bienEliminar.itembiensecId))
      setBienEliminar(null)
      setMensaje('Bien eliminado correctamente')
    } catch {
      setMensaje('Error al eliminar el bien.')
    }
  }

  const option = (value: string | number, label: string) => ({
    value: String(value),
    label,
  })

  const columns: Column<BienSecuestradoRow>[] = [
    {
      accessor: 'cattipoId',
      title: 'Tipo',
      render: (row) =>
        tipos.find((t) => String(t.cattipoId) === String(row.cattipoId))
          ?.descripcion ?? String(row.cattipoId),
    },
    { accessor: 'lugarSecuestro', title: 'Lugar' },
    {
      accessor: 'idTipoVinculo',
      title: 'Vínculo',
      render: (row) => row.tipoVinculo?.descripcion ?? '-',
    },
    { accessor: 'nombreCompletoVinculo', title: 'Vinculado' },
    {
      accessor: 'costoAprox',
      title: 'Costo aprox.',
      render: (row) => formatMoney(row.costoAprox ?? 0),
    },
    {
      accessor: 'pericia',
      title: 'Pericia',
      render: (row) => (row.pericia ? 'Sí' : 'No'),
    },
    {
      accessor: 'ultimaSituacionJuridica',
      title: 'Situación',
      render: (row) =>
        (
          (row.ultimaSituacionJuridica as { descripcionTipo?: string } | null)
            ?.descripcionTipo ?? '-'
        ),
    },
    {
      accessor: 'itembiensecId',
      title: 'Acciones',
      render: (row) => (
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            className="!p-1.5"
            title="Ver detalle"
            onClick={() => setBienDetalle(row)}
          >
            <IconEye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="!p-1.5"
            title="Eliminar"
            onClick={() => setBienEliminar(row)}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (vista === 'formulario') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setVista('lista')}
          >
            ← Volver
          </Button>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            Registrar Bien Identificado
          </h6>
        </div>

        <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <span className="font-semibold">Actuación seleccionada: </span>
          {actuaciones.find((a) => String(a.opId) === String(opId))?.opNrooper ??
            'Sin seleccionar'}
          {opId ? ` (opId ${opId})` : ''}
        </div>

        <div className="panel space-y-6 p-5">
          <Fieldset title="Bien / Clase / Tipo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Bien *
                </label>
                <Select
                  options={bienesCatalogo.map((b) => option(b.bienId, b.descripcion))}
                  placeholder="Seleccione bien"
                  value={form.bienId ? String(form.bienId) : ''}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      bienId: Number(e.target.value),
                      claseId: 0,
                      tipoId: 0,
                      caracteristicas: [],
                    }))
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Clase *
                </label>
                <Select
                  options={clases.map((c) => option(c.catClasId, c.descripcion))}
                  placeholder="Seleccione clase"
                  value={form.claseId ? String(form.claseId) : ''}
                  disabled={!form.bienId}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      claseId: Number(e.target.value),
                      tipoId: 0,
                      caracteristicas: [],
                    }))
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo *
                </label>
                <Select
                  options={tipos.map((t) => option(t.cattipoId, t.descripcion))}
                  placeholder="Seleccione tipo"
                  value={form.tipoId ? String(form.tipoId) : ''}
                  disabled={!form.claseId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tipoId: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Dirección">
            <Input
              value={form.direccion}
              onChange={(e) => setField('direccion', e.target.value)}
              placeholder="Lugar / dirección del bien"
            />
          </Fieldset>

          <Fieldset title="Coordenadas *">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Latitud
                    </label>
                    <Input
                      value={form.latitud != null ? String(form.latitud) : ''}
                      readOnly
                      placeholder="Seleccionar en mapa"
                      className="bg-gray-50 dark:bg-[#1b2e4b]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Longitud
                    </label>
                    <Input
                      value={form.longitud != null ? String(form.longitud) : ''}
                      readOnly
                      placeholder="Seleccionar en mapa"
                      className="bg-gray-50 dark:bg-[#1b2e4b]"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                className="gap-2 shrink-0"
                onClick={abrirMapa}
              >
                📍 Seleccionar en mapa
              </Button>
            </div>
          </Fieldset>

          <Fieldset title="Vínculo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Vínculo *
                </label>
                <Select
                  options={vinculos.map((v) => option(v.idVinculo, v.descripcion))}
                  placeholder="Seleccione vínculo"
                  value={form.idVinculo ? String(form.idVinculo) : ''}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      idVinculo: Number(e.target.value),
                      idTipoVinculo: 0,
                    }))
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo de vínculo *
                </label>
                <Select
                  options={tiposVinculo.map((t) => option(t.idTipoVinculo, t.descripcion))}
                  placeholder="Seleccione tipo"
                  value={form.idTipoVinculo ? String(form.idTipoVinculo) : ''}
                  disabled={!form.idVinculo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      idTipoVinculo: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Nombre vinculado *
                </label>
                <Input
                  value={form.nombreCompletoVinculo}
                  onChange={(e) => setField('nombreCompletoVinculo', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  CI vinculado *
                </label>
                <Input
                  value={form.cedulaIdentidadVinculo}
                  onChange={(e) => setField('cedulaIdentidadVinculo', e.target.value)}
                  placeholder="Carnet de identidad"
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Depositario">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Nombre Depositario
                </label>
                <Input
                  value={form.nombreDepositario}
                  onChange={(e) => setField('nombreDepositario', e.target.value)}
                  placeholder="Nombre del depositario"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  CI Depositario
                </label>
                <Input
                  value={form.ciDepositario}
                  onChange={(e) => setField('ciDepositario', e.target.value)}
                  placeholder="CI del depositario"
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Valores">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Valor comercial aprox. (BOB) *
                </label>
                <Input
                  type="number"
                  value={form.costoAprox || ''}
                  onChange={(e) => setField('costoAprox', Number(e.target.value))}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Cuantía presuntamente ilegal (BOB)
                </label>
                <Input
                  type="number"
                  value={form.costoCuant || ''}
                  onChange={(e) => setField('costoCuant', Number(e.target.value))}
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Pericia">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  ¿Se realizó pericia? *
                </label>
                <Select
                  options={[
                    { value: 'true', label: 'Sí' },
                    { value: 'false', label: 'No' },
                  ]}
                  placeholder="Seleccione"
                  value={String(form.pericia)}
                  onChange={(e) => {
                    const val = e.target.value === 'true'
                    setForm((prev) => ({
                      ...prev,
                      pericia: val,
                      resultadoPericia: val ? prev.resultadoPericia : '',
                    }))
                  }}
                />
              </div>
              {form.pericia && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Resultado Pericia *
                  </label>
                  <textarea
                    className="form-textarea w-full"
                    rows={3}
                    value={form.resultadoPericia}
                    onChange={(e) => setField('resultadoPericia', e.target.value)}
                    placeholder="Describa el resultado de la pericia..."
                  />
                </div>
              )}
            </div>
          </Fieldset>

          <Fieldset title="Situación legal del bien">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo de situación *
                </label>
                <Select
                  options={tiposSituacion.map((t) => option(t.etId, t.descripcion))}
                  placeholder="Seleccione tipo de situación"
                  value={
                    form.idTipoSituacionLegalBien
                      ? String(form.idTipoSituacionLegalBien)
                      : ''
                  }
                  onChange={(e) =>
                    setField('idTipoSituacionLegalBien', Number(e.target.value))
                  }
                />
              </div>
            </div>

            {form.idTipoSituacionLegalBien === 1 && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fiscal
                  </label>
                  <Input
                    value={form.fiscal}
                    onChange={(e) => setField('fiscal', e.target.value)}
                    placeholder="Nombre del fiscal"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha acta de secuestro *
                  </label>
                  <Input
                    type="date"
                    value={form.fechaActaSecuestro}
                    onChange={(e) => setField('fechaActaSecuestro', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Investigador
                  </label>
                  <Input
                    value={form.investigador}
                    onChange={(e) => setField('investigador', e.target.value)}
                    placeholder="Nombre del investigador"
                  />
                </div>
              </div>
            )}

            {form.idTipoSituacionLegalBien === 2 && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Nro resolución
                  </label>
                  <Input
                    value={form.nroResol}
                    onChange={(e) => setField('nroResol', e.target.value)}
                    placeholder="RES-123/2026"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha de resolución *
                  </label>
                  <Input
                    type="date"
                    value={form.fechaResolucion}
                    onChange={(e) => setField('fechaResolucion', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Autoridad
                  </label>
                  <Input
                    value={form.autoridad}
                    onChange={(e) => setField('autoridad', e.target.value)}
                    placeholder="Autoridad que emitió la resolución"
                  />
                </div>
              </div>
            )}

            {form.idTipoSituacionLegalBien === 3 && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Nro sentencia judicial
                  </label>
                  <Input
                    value={form.numSentJud}
                    onChange={(e) => setField('numSentJud', e.target.value)}
                    placeholder="SENT-123/2026"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha de sentencia *
                  </label>
                  <Input
                    type="date"
                    value={form.fechaSenjud}
                    onChange={(e) => setField('fechaSenjud', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Autoridad
                  </label>
                  <Input
                    value={form.autoridad}
                    onChange={(e) => setField('autoridad', e.target.value)}
                    placeholder="Autoridad que emitió la sentencia"
                  />
                </div>
              </div>
            )}

            {(form.idTipoSituacionLegalBien === 4 ||
              form.idTipoSituacionLegalBien === 5) && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha requerimiento *
                  </label>
                  <Input
                    type="date"
                    value={form.fechaRequerimiento}
                    onChange={(e) => setField('fechaRequerimiento', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fiscal requirente
                  </label>
                  <Input
                    value={form.fiscalRequirente}
                    onChange={(e) => setField('fiscalRequirente', e.target.value)}
                    placeholder="Nombre del fiscal"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Calidad del bien
                  </label>
                  <Select
                    options={calidades.map((c) => option(c.calbId, c.descripcion))}
                    placeholder="Seleccione calidad"
                    value={form.calbId ? String(form.calbId) : ''}
                    onChange={(e) =>
                      setField('calbId', Number(e.target.value) || null)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha de entrega
                  </label>
                  <Input
                    type="date"
                    value={form.fechaEntrega}
                    onChange={(e) => setField('fechaEntrega', e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Responsable entrega *
                  </label>
                  <Input
                    value={form.responsableEntrega}
                    onChange={(e) => setField('responsableEntrega', e.target.value)}
                    placeholder="Responsable de la entrega"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Responsable recepción *
                  </label>
                  <Input
                    value={form.responsableRecepcion}
                    onChange={(e) => setField('responsableRecepcion', e.target.value)}
                    placeholder="Responsable de la recepción"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Institución *
                  </label>
                  <Input
                    value={form.institucion}
                    onChange={(e) => setField('institucion', e.target.value)}
                    placeholder="Institución que recibe el bien"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Ubicación
                  </label>
                  <Input
                    value={form.ubicacion}
                    onChange={(e) => setField('ubicacion', e.target.value)}
                    placeholder="Ubicación actual del bien"
                  />
                </div>
              </div>
            )}
          </Fieldset>

          <Fieldset title="Características">
            <div className="space-y-3">
              {form.caracteristicas.length === 0 && (
                <p className="text-xs text-gray-500">
                  No hay características registradas. Haga clic en &quot;Agregar&quot;
                  para añadir una.
                </p>
              )}
              {form.caracteristicas.map((car, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="w-48 shrink-0">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Característica
                    </label>
                    <Select
                      options={caracteristicasCatalogo.map((c) =>
                        option(c.catcaracId, c.descripcion)
                      )}
                      placeholder="Seleccione"
                      value={car.catcaracId ? String(car.catcaracId) : ''}
                      onChange={(e) =>
                        actualizarCaracteristica(
                          index,
                          'catcaracId',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Descripción
                    </label>
                    <Input
                      value={car.descripcion}
                      onChange={(e) =>
                        actualizarCaracteristica(index, 'descripcion', e.target.value)
                      }
                      placeholder="Descripción"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    className="!p-1.5 shrink-0 mb-0.5"
                    onClick={() => eliminarCaracteristica(index)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                className="gap-2"
                onClick={agregarCaracteristica}
                disabled={!form.claseId || caracteristicasCatalogo.length === 0}
              >
                <IconPlus className="h-4 w-4" />
                Agregar característica
              </Button>
            </div>
          </Fieldset>

          <Fieldset title="Fotografías">
            <div className="flex flex-col gap-3">
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  id="fotos-bien"
                  onChange={(e) => agregarFotografias(e.target.files)}
                />
                <label
                  htmlFor="fotos-bien"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-primary hover:bg-primary/5 dark:border-[#1b2e4b] dark:text-gray-400"
                >
                  <IconPlus className="h-4 w-4" />
                  Seleccionar fotografías (JPG/PNG/WEBP, máx. 20)
                </label>
              </div>
              {form.fotografias.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {form.fotografias.map((foto, index) => (
                    <li
                      key={`${foto.name}-${index}`}
                      className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs dark:border-[#1b2e4b]"
                    >
                      <span className="max-w-[180px] truncate">{foto.name}</span>
                      <button
                        type="button"
                        className="text-danger hover:text-danger/70"
                        onClick={() => quitarFotografia(index)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Fieldset>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setVista('lista')}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            loading={guardando}
            disabled={!isFormValid}
            onClick={onSubmit}
          >
            Guardar
          </Button>
        </div>

        {mapaOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
                <h3 className="text-lg font-bold text-dark dark:text-white-light">
                  Seleccionar Ubicación
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setMapaOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="p-5">
                <p className="mb-3 text-xs text-gray-500">
                  Haga clic en el mapa para colocar el marcador. Luego confirme.
                </p>
                <MapaConMarcador
                  id="mapa-bien"
                  mapRef={mapRef}
                  coordenadas={coordenadas}
                  onClick={handleMapClick}
                  height={400}
                  zoom={coordenadas ? 15 : 6}
                  scrollWheelZoom={true}
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setMapaOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={confirmarMapa}>
                  Confirmar ubicación
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            Bienes Identificados
          </h6>
          <p className="text-xs text-gray-500">
            Inventario de bienes identificados en el caso.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="gap-2"
          onClick={abrirCrear}
          disabled={!opId}
        >
          <IconPlus className="h-4 w-4" />
          Nuevo Bien
        </Button>
      </div>

      {mensaje && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {mensaje}
        </div>
      )}

      <div className="panel p-4">
        <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
          Actuación realizada *
        </label>
        <Select
          options={actuaciones.map((a) => option(a.opId, `${a.opNrooper} (${formatFecha(a.opFechainf, 'dd/MM/yyyy')})`))}
          placeholder="Seleccione la actuación"
          value={opId != null ? String(opId) : ''}
          onChange={(e) => {
            setOpId(Number(e.target.value) || null)
            setPage(1)
          }}
        />
        <p className="mt-1 text-xs text-gray-500">
          Seleccione la actuación para listar o registrar los bienes asociados.
        </p>
      </div>

      {opId == null ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-gray-500">
            Seleccione una actuación para ver sus bienes.
          </p>
        </div>
      ) : (
        <VristoDataTable<BienSecuestradoRow>
          title="Bienes"
          rows={bienesData?.filas ?? []}
          total={bienesData?.total ?? 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
          loading={bienesLoading}
        />
      )}

      {bienDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Detalle del Bien
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setBienDetalle(null)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetalleCampo
                  label="Tipo"
                  value={
                    tipos.find(
                      (t) => String(t.cattipoId) === String(bienDetalle.cattipoId)
                    )?.descripcion ?? String(bienDetalle.cattipoId)
                  }
                />
                <DetalleCampo label="Lugar" value={bienDetalle.lugarSecuestro} />
                <DetalleCampo
                  label="Latitud"
                  value={
                    bienDetalle.latitud != null
                      ? String(bienDetalle.latitud)
                      : null
                  }
                />
                <DetalleCampo
                  label="Longitud"
                  value={
                    bienDetalle.longitud != null
                      ? String(bienDetalle.longitud)
                      : null
                  }
                />
                <DetalleCampo
                  label="Vínculo"
                  value={bienDetalle.tipoVinculo?.descripcion}
                />
                <DetalleCampo
                  label="Vinculado"
                  value={bienDetalle.nombreCompletoVinculo}
                />
                <DetalleCampo
                  label="CI Vinculado"
                  value={bienDetalle.cedulaIdentidadVinculo}
                />
                <DetalleCampo
                  label="Nombre Depositario"
                  value={bienDetalle.nombreDepositario}
                />
                <DetalleCampo
                  label="CI Depositario"
                  value={bienDetalle.ciDepositario}
                />
                <DetalleCampo
                  label="Costo aprox. (BOB)"
                  value={formatMoney(bienDetalle.costoAprox ?? 0)}
                />
                <DetalleCampo
                  label="Cuantía (BOB)"
                  value={
                    bienDetalle.costoCuant != null
                      ? formatMoney(bienDetalle.costoCuant)
                      : null
                  }
                />
                <DetalleCampo
                  label="Pericia"
                  value={bienDetalle.pericia ? 'Sí' : 'No'}
                />
                {bienDetalle.pericia && (
                  <DetalleCampo
                    label="Resultado Pericia"
                    value={bienDetalle.resultadoPericia}
                    full
                  />
                )}
                <DetalleCampo
                  label="Situación"
                  value={
                    (
                      bienDetalle.ultimaSituacionJuridica as {
                        descripcionTipo?: string
                      } | null
                    )?.descripcionTipo ?? '-'
                  }
                />
                <DetalleCampo
                  label="Fecha Ingreso"
                  value={formatFecha(bienDetalle.fechaHoraIngreso)}
                />
              </div>
              {bienDetalle.caracteristicas?.length ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                    Características
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#1b2e4b]">
                        <th className="pb-1 text-left text-xs font-semibold text-gray-500">
                          Característica
                        </th>
                        <th className="pb-1 text-left text-xs font-semibold text-gray-500">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bienDetalle.caracteristicas.map((c, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-100 dark:border-[#1b2e4b]/50"
                        >
                          <td className="py-1.5 text-dark dark:text-white-light">
                            {caracteristicasCatalogo.find(
                              (cc) => cc.catcaracId === c.catcaracId
                            )?.descripcion ?? String(c.catcaracId)}
                          </td>
                          <td className="py-1.5 text-dark dark:text-white-light">
                            {c.descripcion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
            <div className="flex justify-end border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setBienDetalle(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {bienEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="p-5 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                <IconTrash className="h-6 w-6 text-danger" />
              </div>
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Eliminar Bien
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                ¿Está seguro que desea eliminar este bien? Esta acción no se puede
                deshacer.
              </p>
            </div>
            <div className="flex justify-center gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setBienEliminar(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={confirmarEliminar}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Fieldset({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
        {title}
      </h4>
      {children}
    </div>
  )
}

function DetalleCampo({
  label,
  value,
  full,
}: {
  label: string
  value: string | number | null | undefined
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-dark dark:text-white-light">
        {value != null && value !== '' ? String(value) : '-'}
      </p>
    </div>
  )
}