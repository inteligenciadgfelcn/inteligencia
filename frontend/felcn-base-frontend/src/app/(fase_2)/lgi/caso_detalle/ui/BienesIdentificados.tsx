'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Map as LeafletMap } from 'leaflet'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconPlus from '@/components/Icon/IconPlus'
import IconEdit from '@/components/Icon/IconEdit'
import IconTrash from '@/components/Icon/IconTrash'
import IconEye from '@/components/Icon/IconEye'

import type {
  BienIdentificado,
  ClaseBien,
  TipoBien,
} from '../types/bienes.types'
import {
  CATALOGO_BIENES,
  TIPOS_VINCULO,
  SITUACIONES_LEGALES,
  CARACTERISTICAS_POR_BIEN,
  VALORES_POR_DEFECTO,
} from '../types/bienes.types'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  { ssr: false }
)

type Props = {
  casoId: number
}

let nextId = 100

function formatFecha(fecha: string | null | undefined): string {
  if (!fecha) return '-'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleDateString('es-BO')
}

function formatMoney(valor: number): string {
  return valor.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const initialBien: Omit<BienIdentificado, 'id' | 'casosId'> = {
  ...VALORES_POR_DEFECTO,
}

export function BienesIdentificados({ casoId }: Props) {
  const [bienes, setBienes] = useState<BienIdentificado[]>(() => [
    {
      id: 1,
      casosId: casoId,
      bienId: 1,
      claseId: 11,
      tipoId: 111,
      caracteristicas: [
        { id: 'c1', nombreCaracteristica: 'Color', descripcion: 'Blanco' },
        { id: 'c2', nombreCaracteristica: 'Metros cuadrados', descripcion: '120' },
      ],
      direccion: 'Av. Libertador #1234, Zona Sur',
      latitud: -17.413,
      longitud: -66.165,
      tipoVinculo: 'Titular',
      nombre: 'Juan Pérez',
      ci: '1234567',
      nombreDepositario: 'María López',
      ciDepositario: '7654321',
      situacionLegal: 'Secuestrado',
      fechaSituacionLegal: '2026-03-15',
      cuantiaPresunta: 250000,
      valorComercial: 280000,
      pericia: true,
      resultadoPericia: 'Inmueble apto para secuestro, sin gravámenes',
      autoridadDispuso: 'Fiscalía Deptal. de Cochabamba',
      fechaHoraIng: '2026-03-15T10:30:00',
      usuario: 'admin',
    },
    {
      id: 2,
      casosId: casoId,
      bienId: 2,
      claseId: 21,
      tipoId: 211,
      caracteristicas: [
        { id: 'c3', nombreCaracteristica: 'Marca', descripcion: 'Toyota' },
        { id: 'c4', nombreCaracteristica: 'Modelo', descripcion: 'Hilux' },
        { id: 'c5', nombreCaracteristica: 'Año', descripcion: '2022' },
        { id: 'c6', nombreCaracteristica: 'Nro placa', descripcion: '1234ABC' },
      ],
      direccion: 'Calle Bolívar #567',
      latitud: -17.399,
      longitud: -66.157,
      tipoVinculo: 'Poseedor',
      nombre: 'Carlos Mendoza',
      ci: '9876543',
      nombreDepositario: '',
      ciDepositario: '',
      situacionLegal: 'Incautado',
      fechaSituacionLegal: '2026-04-20',
      cuantiaPresunta: 180000,
      valorComercial: 195000,
      pericia: false,
      resultadoPericia: '',
      autoridadDispuso: 'Fiscalía del Distrito 8',
      fechaHoraIng: '2026-04-20T14:15:00',
      usuario: 'admin',
    },
  ])

  const [vista, setVista] = useState<'lista' | 'formulario'>('lista')
  const [bienEditando, setBienEditando] = useState<BienIdentificado | null>(null)
  const [bienDetalle, setBienDetalle] = useState<BienIdentificado | null>(null)
  const [bienEliminar, setBienEliminar] = useState<BienIdentificado | null>(null)
  const [mapaOpen, setMapaOpen] = useState(false)
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null)

  const [form, setForm] = useState<Omit<BienIdentificado, 'id' | 'casosId'>>(initialBien)

  const mapRef = useRef<LeafletMap | null>(null)

  const clases: ClaseBien[] = form.bienId
    ? CATALOGO_BIENES.find((b) => b.id === form.bienId)?.clases ?? []
    : []

  const tipos: TipoBien[] = form.claseId
    ? clases.find((c) => c.id === form.claseId)?.tipos ?? []
    : []

  const nombresCaracteristicas = form.bienId
    ? CARACTERISTICAS_POR_BIEN[form.bienId] ?? CARACTERISTICAS_POR_BIEN[13]
    : []

  useEffect(() => {
    if (coordenadas) {
      setForm((prev) => ({
        ...prev,
        latitud: coordenadas[0],
        longitud: coordenadas[1],
      }))
    }
  }, [coordenadas])

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const abrirCrear = () => {
    setBienEditando(null)
    setForm({ ...initialBien, caracteristicas: [] })
    setCoordenadas(null)
    setVista('formulario')
  }

  const abrirEditar = (bien: BienIdentificado) => {
    setBienEditando(bien)
    setForm({
      bienId: bien.bienId,
      claseId: bien.claseId,
      tipoId: bien.tipoId,
      caracteristicas: bien.caracteristicas.map((c) => ({ ...c })),
      direccion: bien.direccion,
      latitud: bien.latitud,
      longitud: bien.longitud,
      tipoVinculo: bien.tipoVinculo,
      nombre: bien.nombre,
      ci: bien.ci,
      nombreDepositario: bien.nombreDepositario,
      ciDepositario: bien.ciDepositario,
      situacionLegal: bien.situacionLegal,
      fechaSituacionLegal: bien.fechaSituacionLegal,
      cuantiaPresunta: bien.cuantiaPresunta,
      valorComercial: bien.valorComercial,
      pericia: bien.pericia,
      resultadoPericia: bien.resultadoPericia,
      autoridadDispuso: bien.autoridadDispuso,
      fechaHoraIng: bien.fechaHoraIng,
      usuario: bien.usuario,
    })
    setCoordenadas(
      bien.latitud != null && bien.longitud != null
        ? [bien.latitud, bien.longitud]
        : null
    )
    setVista('formulario')
  }

  const eliminarBien = (bien: BienIdentificado) => {
    setBienes((prev) => prev.filter((b) => b.id !== bien.id))
    setBienEliminar(null)
  }

  const guardar = () => {
    const now = new Date().toISOString()
    if (bienEditando) {
      setBienes((prev) =>
        prev.map((b) =>
          b.id === bienEditando.id
            ? { ...b, ...form, fechaActualizacion: now }
            : b
        )
      )
    } else {
      const nuevo: BienIdentificado = {
        id: nextId++,
        casosId: casoId,
        ...form,
        fechaHoraIng: now,
        usuario: '_usuario_actual',
      }
      setBienes((prev) => [...prev, nuevo])
    }
    setVista('lista')
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
    const nombresUsados = form.caracteristicas.map((c) => c.nombreCaracteristica)
    const disponible = nombresCaracteristicas.find(
      (n) => !nombresUsados.includes(n)
    )
    setForm((prev) => ({
      ...prev,
      caracteristicas: [
        ...prev.caracteristicas,
        {
          id: `new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          nombreCaracteristica: disponible ?? nombresCaracteristicas[0] ?? '',
          descripcion: '',
        },
      ],
    }))
  }

  const actualizarCaracteristica = (
    id: string,
    campo: 'nombreCaracteristica' | 'descripcion',
    valor: string
  ) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((c) =>
        c.id === id ? { ...c, [campo]: valor } : c
      ),
    }))
  }

  const eliminarCaracteristica = (id: string) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((c) => c.id !== id),
    }))
  }

  const isFormValid =
    form.bienId > 0 &&
    form.claseId > 0 &&
    form.tipoId > 0 &&
    form.direccion.trim() !== '' &&
    form.latitud != null &&
    form.longitud != null &&
    form.tipoVinculo !== '' &&
    form.nombre.trim() !== '' &&
    form.ci.trim() !== '' &&
    form.situacionLegal !== '' &&
    form.fechaSituacionLegal !== '' &&
    form.autoridadDispuso.trim() !== '' &&
    (!form.pericia || form.resultadoPericia.trim() !== '')

  const columns: Column<BienIdentificado>[] = [
    {
      accessor: 'bienId',
      title: 'Bien',
      render: (row) =>
        CATALOGO_BIENES.find((b) => b.id === row.bienId)?.descripcion ?? '-',
    },
    {
      accessor: 'claseId',
      title: 'Clase',
      render: (row) => {
        const bien = CATALOGO_BIENES.find((b) => b.id === row.bienId)
        return bien?.clases.find((c) => c.id === row.claseId)?.descripcion ?? '-'
      },
    },
    {
      accessor: 'tipoId',
      title: 'Tipo',
      render: (row) => {
        const bien = CATALOGO_BIENES.find((b) => b.id === row.bienId)
        const clase = bien?.clases.find((c) => c.id === row.claseId)
        return clase?.tipos.find((t) => t.id === row.tipoId)?.descripcion ?? '-'
      },
    },
    { accessor: 'direccion', title: 'Dirección' },
    {
      accessor: 'situacionLegal',
      title: 'Sit. Legal',
      render: (row) => (
        <span
          className={`badge ${
            row.situacionLegal === 'Secuestrado'
              ? 'badge-outline-success'
              : row.situacionLegal === 'Incautado'
                ? 'badge-outline-warning'
                : 'badge-outline-info'
          }`}
        >
          {row.situacionLegal}
        </span>
      ),
    },
    { accessor: 'tipoVinculo', title: 'Vínculo' },
    { accessor: 'nombre', title: 'Nombre' },
    {
      accessor: 'pericia',
      title: 'Pericia',
      render: (row) => (row.pericia ? 'Sí' : 'No'),
    },
    {
      accessor: 'id',
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
            variant="outline-secondary"
            size="sm"
            className="!p-1.5"
            title="Editar"
            onClick={() => abrirEditar(row)}
          >
            <IconEdit className="h-4 w-4" />
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
            {bienEditando ? 'Editar Bien Identificado' : 'Registrar Bien Identificado'}
          </h6>
        </div>

        <div className="panel space-y-6 p-5">
          <Fieldset title="Bien / Clase / Tipo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Bien *
                </label>
                <Select
                  options={CATALOGO_BIENES.map((b) => ({
                    value: String(b.id),
                    label: b.descripcion,
                  }))}
                  placeholder="Seleccione bien"
                  value={form.bienId ? String(form.bienId) : ''}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setForm((prev) => ({
                      ...prev,
                      bienId: val,
                      claseId: 0,
                      tipoId: 0,
                    }))
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Clase *
                </label>
                <Select
                  options={clases.map((c) => ({
                    value: String(c.id),
                    label: c.descripcion,
                  }))}
                  placeholder="Seleccione clase"
                  value={form.claseId ? String(form.claseId) : ''}
                  disabled={!form.bienId}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setForm((prev) => ({ ...prev, claseId: val, tipoId: 0 }))
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo *
                </label>
                <Select
                  options={tipos.map((t) => ({
                    value: String(t.id),
                    label: t.descripcion,
                  }))}
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
              placeholder="Dirección completa del bien"
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
            {form.latitud != null && form.longitud != null && (
              <p className="mt-2 text-xs text-gray-500">
                Coordenadas seleccionadas: {form.latitud.toFixed(6)}, {form.longitud.toFixed(6)}
              </p>
            )}
          </Fieldset>

          <Fieldset title="Datos del Vínculo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo Vínculo *
                </label>
                <Select
                  options={TIPOS_VINCULO.map((v) => ({ value: v, label: v }))}
                  placeholder="Seleccione vínculo"
                  value={form.tipoVinculo}
                  onChange={(e) => setField('tipoVinculo', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Nombre *
                </label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setField('nombre', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  CI *
                </label>
                <Input
                  value={form.ci}
                  onChange={(e) => setField('ci', e.target.value)}
                  placeholder="Carnet de identidad"
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Datos del Depositario">
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

          <Fieldset title="Situación Legal">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Situación Legal *
                </label>
                <Select
                  options={SITUACIONES_LEGALES.map((s) => ({ value: s, label: s }))}
                  placeholder="Seleccione situación"
                  value={form.situacionLegal}
                  onChange={(e) => setField('situacionLegal', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Fecha Situación Legal *
                </label>
                <Input
                  type="date"
                  value={form.fechaSituacionLegal}
                  onChange={(e) => setField('fechaSituacionLegal', e.target.value)}
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Valores">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Cuantía Presuntamente Ilegal (BOB) *
                </label>
                <Input
                  type="number"
                  value={form.cuantiaPresunta || ''}
                  onChange={(e) =>
                    setField('cuantiaPresunta', Number(e.target.value))
                  }
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Valor Comercial Aproximado (BOB) *
                </label>
                <Input
                  type="number"
                  value={form.valorComercial || ''}
                  onChange={(e) =>
                    setField('valorComercial', Number(e.target.value))
                  }
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

          <Fieldset title="Autoridad que Dispuso">
            <Input
              value={form.autoridadDispuso}
              onChange={(e) => setField('autoridadDispuso', e.target.value)}
              placeholder="Nombre de la autoridad que dispuso la medida"
            />
          </Fieldset>

          <Fieldset title="Características">
            <div className="space-y-3">
              {form.caracteristicas.length === 0 && (
                <p className="text-xs text-gray-500">
                  No hay características registradas. Haga clic en &quot;Agregar&quot; para añadir una.
                </p>
              )}
              {form.caracteristicas.map((car) => (
                <div key={car.id} className="flex items-end gap-2">
                  <div className="w-48 shrink-0">
                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Característica
                    </label>
                    <Select
                      options={nombresCaracteristicas.map((n) => ({
                        value: n,
                        label: n,
                      }))}
                      placeholder="Seleccione"
                      value={car.nombreCaracteristica}
                      onChange={(e) =>
                        actualizarCaracteristica(
                          car.id,
                          'nombreCaracteristica',
                          e.target.value
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
                        actualizarCaracteristica(
                          car.id,
                          'descripcion',
                          e.target.value
                        )
                      }
                      placeholder="Descripción"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    className="!p-1.5 shrink-0 mb-0.5"
                    onClick={() => eliminarCaracteristica(car.id)}
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
              >
                <IconPlus className="h-4 w-4" />
                Agregar característica
              </Button>
            </div>
          </Fieldset>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setVista('lista')}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!isFormValid}
            onClick={guardar}
          >
            {bienEditando ? 'Actualizar' : 'Guardar'}
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
        >
          <IconPlus className="h-4 w-4" />
          Nuevo Bien
        </Button>
      </div>

      <VristoDataTable<BienIdentificado>
        title="Bienes"
        rows={bienes}
        total={bienes.length}
        page={1}
        limit={10}
        onPageChange={() => {}}
        onLimitChange={() => {}}
        columns={columns}
        loading={false}
      />

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
                  label="Bien"
                  value={
                    CATALOGO_BIENES.find((b) => b.id === bienDetalle.bienId)
                      ?.descripcion
                  }
                />
                <DetalleCampo
                  label="Clase"
                  value={
                    CATALOGO_BIENES.find((b) => b.id === bienDetalle.bienId)
                      ?.clases.find((c) => c.id === bienDetalle.claseId)
                      ?.descripcion
                  }
                />
                <DetalleCampo
                  label="Tipo"
                  value={
                    CATALOGO_BIENES.find((b) => b.id === bienDetalle.bienId)
                      ?.clases.find((c) => c.id === bienDetalle.claseId)
                      ?.tipos.find((t) => t.id === bienDetalle.tipoId)
                      ?.descripcion
                  }
                />
                <DetalleCampo label="Dirección" value={bienDetalle.direccion} />
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
                <DetalleCampo label="Tipo Vínculo" value={bienDetalle.tipoVinculo} />
                <DetalleCampo label="Nombre" value={bienDetalle.nombre} />
                <DetalleCampo label="CI" value={bienDetalle.ci} />
                <DetalleCampo
                  label="Nombre Depositario"
                  value={bienDetalle.nombreDepositario}
                />
                <DetalleCampo
                  label="CI Depositario"
                  value={bienDetalle.ciDepositario}
                />
                <DetalleCampo
                  label="Situación Legal"
                  value={bienDetalle.situacionLegal}
                />
                <DetalleCampo
                  label="Fecha Sit. Legal"
                  value={formatFecha(bienDetalle.fechaSituacionLegal)}
                />
                <DetalleCampo
                  label="Cuantía Presunta (BOB)"
                  value={formatMoney(bienDetalle.cuantiaPresunta)}
                />
                <DetalleCampo
                  label="Valor Comercial (BOB)"
                  value={formatMoney(bienDetalle.valorComercial)}
                />
                <DetalleCampo
                  label="Pericia"
                  value={bienDetalle.pericia ? 'Sí' : 'No'}
                />
                {bienDetalle.pericia && (
                  <div className="md:col-span-2">
                    <DetalleCampo
                      label="Resultado Pericia"
                      value={bienDetalle.resultadoPericia}
                      full
                    />
                  </div>
                )}
                <DetalleCampo
                  label="Autoridad que Dispuso"
                  value={bienDetalle.autoridadDispuso}
                />
              </div>

              {bienDetalle.caracteristicas.length > 0 && (
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
                      {bienDetalle.caracteristicas.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-100 dark:border-[#1b2e4b]/50"
                        >
                          <td className="py-1.5 text-dark dark:text-white-light">
                            {c.nombreCaracteristica}
                          </td>
                          <td className="py-1.5 text-dark dark:text-white-light">
                            {c.descripcion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                ¿Está seguro que desea eliminar este bien? Esta acción no se
                puede deshacer.
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
                onClick={() => eliminarBien(bienEliminar)}
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
