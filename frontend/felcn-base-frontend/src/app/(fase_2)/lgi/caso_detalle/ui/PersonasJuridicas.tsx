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

import type { PersonaJuridica } from '../types/personas-juridicas.types'
import {
  VINCULOS_INVESTIGACION,
  VALORES_POR_DEFECTO_PJ,
} from '../types/personas-juridicas.types'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  { ssr: false }
)

type Props = {
  casoId: number
}

let nextId = 200

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

export function PersonasJuridicas({ casoId }: Props) {
  const [personas, setPersonas] = useState<PersonaJuridica[]>(() => [
    {
      id: 1,
      casosId: casoId,
      nombreRazonSocial: 'Transportes Bolívar S.R.L.',
      nit: '1234567890',
      matricula: 'MAT-2020-001234',
      propietarioSocios: 'Juan Pérez (60%), María López (40%)',
      representanteLegal: 'Juan Pérez García',
      beneficiariosFinales: 'Juan Pérez García, María López de RAMIREZ',
      capitalSocial: 500000,
      direccion: 'Av. Industrial #456, Zona Industrial',
      latitud: -17.401,
      longitud: -66.162,
      vinculoInvestigacion: 'Investigada con responsabilidad',
      situacionJuridica: 'Vinculada al delito de lavado de activos',
      fechaSituacionJuridica: '2026-05-10',
      pericia: true,
      resultadoPericia: 'Se encontraron transferencias irregulares por Bs. 2.3M',
      fechaHoraIng: '2026-05-10T09:00:00',
      usuario: 'admin',
    },
    {
      id: 2,
      casosId: casoId,
      nombreRazonSocial: 'Minera San Cristóbal S.A.',
      nit: '9876543210',
      matricula: 'MAT-2018-005678',
      propietarioSocios: 'Grupo Inversor SAC (100%)',
      representanteLegal: 'Carlos Mendoza López',
      beneficiariosFinales: 'Grupo Inversor SAC',
      capitalSocial: 12000000,
      direccion: 'Calle Comercio #789, Centro',
      latitud: -17.395,
      longitud: -66.153,
      vinculoInvestigacion: 'Identificada',
      situacionJuridica: 'Relación con la investigación por funcionario investigado',
      fechaSituacionJuridica: '2026-06-15',
      pericia: false,
      resultadoPericia: '',
      fechaHoraIng: '2026-06-15T11:30:00',
      usuario: 'admin',
    },
  ])

  const [vista, setVista] = useState<'lista' | 'formulario'>('lista')
  const [personaEditando, setPersonaEditando] = useState<PersonaJuridica | null>(null)
  const [personaDetalle, setPersonaDetalle] = useState<PersonaJuridica | null>(null)
  const [personaEliminar, setPersonaEliminar] = useState<PersonaJuridica | null>(null)
  const [mapaOpen, setMapaOpen] = useState(false)
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null)

  const [form, setForm] = useState<Omit<PersonaJuridica, 'id' | 'casosId'>>(
    VALORES_POR_DEFECTO_PJ
  )

  const mapRef = useRef<LeafletMap | null>(null)

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
    setPersonaEditando(null)
    setForm({ ...VALORES_POR_DEFECTO_PJ })
    setCoordenadas(null)
    setVista('formulario')
  }

  const abrirEditar = (persona: PersonaJuridica) => {
    setPersonaEditando(persona)
    setForm({
      nombreRazonSocial: persona.nombreRazonSocial,
      nit: persona.nit,
      matricula: persona.matricula,
      propietarioSocios: persona.propietarioSocios,
      representanteLegal: persona.representanteLegal,
      beneficiariosFinales: persona.beneficiariosFinales,
      capitalSocial: persona.capitalSocial,
      direccion: persona.direccion,
      latitud: persona.latitud,
      longitud: persona.longitud,
      vinculoInvestigacion: persona.vinculoInvestigacion,
      situacionJuridica: persona.situacionJuridica,
      fechaSituacionJuridica: persona.fechaSituacionJuridica,
      pericia: persona.pericia,
      resultadoPericia: persona.resultadoPericia,
      fechaHoraIng: persona.fechaHoraIng,
      usuario: persona.usuario,
    })
    setCoordenadas(
      persona.latitud != null && persona.longitud != null
        ? [persona.latitud, persona.longitud]
        : null
    )
    setVista('formulario')
  }

  const eliminarPersona = (persona: PersonaJuridica) => {
    setPersonas((prev) => prev.filter((p) => p.id !== persona.id))
    setPersonaEliminar(null)
  }

  const guardar = () => {
    const now = new Date().toISOString()
    if (personaEditando) {
      setPersonas((prev) =>
        prev.map((p) =>
          p.id === personaEditando.id
            ? { ...p, ...form, fechaActualizacion: now }
            : p
        )
      )
    } else {
      const nueva: PersonaJuridica = {
        id: nextId++,
        casosId: casoId,
        ...form,
        fechaHoraIng: now,
        usuario: '_usuario_actual',
      }
      setPersonas((prev) => [...prev, nueva])
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

  const isFormValid =
    form.nombreRazonSocial.trim() !== '' &&
    form.nit.trim() !== '' &&
    form.matricula.trim() !== '' &&
    form.representanteLegal.trim() !== '' &&
    form.capitalSocial > 0 &&
    form.direccion.trim() !== '' &&
    form.latitud != null &&
    form.longitud != null &&
    form.vinculoInvestigacion !== '' &&
    form.situacionJuridica.trim() !== '' &&
    form.fechaSituacionJuridica !== '' &&
    (!form.pericia || form.resultadoPericia.trim() !== '')

  const columns: Column<PersonaJuridica>[] = [
    { accessor: 'nombreRazonSocial', title: 'Nombre / Razón Social' },
    { accessor: 'nit', title: 'NIT' },
    { accessor: 'matricula', title: 'Matrícula' },
    {
      accessor: 'vinculoInvestigacion',
      title: 'Vínculo',
      render: (row) => (
        <span
          className={`badge ${
            row.vinculoInvestigacion === 'Investigada con responsabilidad'
              ? 'badge-outline-danger'
              : 'badge-outline-info'
          }`}
        >
          {row.vinculoInvestigacion}
        </span>
      ),
    },
    {
      accessor: 'situacionJuridica',
      title: 'Situación Jurídica',
      render: (row) => (
        <span className="max-w-[200px] truncate block" title={row.situacionJuridica}>
          {row.situacionJuridica}
        </span>
      ),
    },
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
            onClick={() => setPersonaDetalle(row)}
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
            onClick={() => setPersonaEliminar(row)}
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
            {personaEditando
              ? 'Editar Persona Jurídica'
              : 'Registrar Persona Jurídica'}
          </h6>
        </div>

        <div className="panel space-y-6 p-5">
          <Fieldset title="Datos Generales">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Nombre o Razón Social *
                </label>
                <Input
                  value={form.nombreRazonSocial}
                  onChange={(e) => setField('nombreRazonSocial', e.target.value)}
                  placeholder="Nombre completo o razón social"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  NIT *
                </label>
                <Input
                  value={form.nit}
                  onChange={(e) => setField('nit', e.target.value)}
                  placeholder="1234567890"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Matrícula *
              </label>
              <Input
                value={form.matricula}
                onChange={(e) => setField('matricula', e.target.value)}
                placeholder="MAT-2020-001234"
              />
            </div>
          </Fieldset>

          <Fieldset title="Personas Vinculadas">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Propietario(s) / Socio(s)
                </label>
                <textarea
                  className="form-textarea w-full"
                  rows={2}
                  value={form.propietarioSocios}
                  onChange={(e) => setField('propietarioSocios', e.target.value)}
                  placeholder="Nombre y porcentaje de participación..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Representante Legal *
                </label>
                <Input
                  value={form.representanteLegal}
                  onChange={(e) => setField('representanteLegal', e.target.value)}
                  placeholder="Nombre del representante legal"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Beneficiario(s) Final(es)
              </label>
              <textarea
                className="form-textarea w-full"
                rows={2}
                value={form.beneficiariosFinales}
                onChange={(e) => setField('beneficiariosFinales', e.target.value)}
                placeholder="Beneficiarios finales de la empresa..."
              />
            </div>
          </Fieldset>

          <Fieldset title="Capital Social">
            <div className="max-w-xs">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Capital Social (BOB) *
              </label>
              <Input
                type="number"
                value={form.capitalSocial || ''}
                onChange={(e) => setField('capitalSocial', Number(e.target.value))}
                placeholder="0.00"
                min="0"
              />
            </div>
          </Fieldset>

          <Fieldset title="Ubicación">
            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Dirección *
              </label>
              <Input
                value={form.direccion}
                onChange={(e) => setField('direccion', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Coordenadas *
              </label>
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
                  Coordenadas seleccionadas: {form.latitud.toFixed(6)},{' '}
                  {form.longitud.toFixed(6)}
                </p>
              )}
            </div>
          </Fieldset>

          <Fieldset title="Vinculación con la Investigación">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Vínculo con la Investigación *
                </label>
                <Select
                  options={VINCULOS_INVESTIGACION.map((v) => ({
                    value: v,
                    label: v,
                  }))}
                  placeholder="Seleccione vínculo"
                  value={form.vinculoInvestigacion}
                  onChange={(e) => setField('vinculoInvestigacion', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Fecha Situación Jurídica *
                </label>
                <Input
                  type="date"
                  value={form.fechaSituacionJuridica}
                  onChange={(e) => setField('fechaSituacionJuridica', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Situación Jurídica (Relación con la investigación o investigados) *
              </label>
              <textarea
                className="form-textarea w-full"
                rows={3}
                value={form.situacionJuridica}
                onChange={(e) => setField('situacionJuridica', e.target.value)}
                placeholder="Describa la relación con la investigación..."
              />
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
            {personaEditando ? 'Actualizar' : 'Guardar'}
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
                  id="mapa-pj"
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
            Personas Jurídicas
          </h6>
          <p className="text-xs text-gray-500">
            Empresas y personas jurídicas vinculadas al caso.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="gap-2"
          onClick={abrirCrear}
        >
          <IconPlus className="h-4 w-4" />
          Nueva Persona Jurídica
        </Button>
      </div>

      <VristoDataTable<PersonaJuridica>
        title="Personas Jurídicas"
        rows={personas}
        total={personas.length}
        page={1}
        limit={10}
        onPageChange={() => {}}
        onLimitChange={() => {}}
        columns={columns}
        loading={false}
      />

      {personaDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Detalle de Persona Jurídica
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setPersonaDetalle(null)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetalleCampo
                  label="Nombre / Razón Social"
                  value={personaDetalle.nombreRazonSocial}
                  full
                />
                <DetalleCampo label="NIT" value={personaDetalle.nit} />
                <DetalleCampo label="Matrícula" value={personaDetalle.matricula} />
                <DetalleCampo
                  label="Capital Social (BOB)"
                  value={formatMoney(personaDetalle.capitalSocial)}
                />
                <DetalleCampo
                  label="Representante Legal"
                  value={personaDetalle.representanteLegal}
                />
                <DetalleCampo label="Dirección" value={personaDetalle.direccion} full />
                <DetalleCampo
                  label="Latitud"
                  value={
                    personaDetalle.latitud != null
                      ? String(personaDetalle.latitud)
                      : null
                  }
                />
                <DetalleCampo
                  label="Longitud"
                  value={
                    personaDetalle.longitud != null
                      ? String(personaDetalle.longitud)
                      : null
                  }
                />
                <DetalleCampo
                  label="Propietario(s) / Socio(s)"
                  value={personaDetalle.propietarioSocios}
                  full
                />
                <DetalleCampo
                  label="Beneficiario(s) Final(es)"
                  value={personaDetalle.beneficiariosFinales}
                  full
                />
                <DetalleCampo
                  label="Vínculo con la Investigación"
                  value={personaDetalle.vinculoInvestigacion}
                />
                <DetalleCampo
                  label="Fecha Situación Jurídica"
                  value={formatFecha(personaDetalle.fechaSituacionJuridica)}
                />
                <DetalleCampo
                  label="Situación Jurídica"
                  value={personaDetalle.situacionJuridica}
                  full
                />
                <DetalleCampo
                  label="Pericia"
                  value={personaDetalle.pericia ? 'Sí' : 'No'}
                />
                {personaDetalle.pericia && (
                  <DetalleCampo
                    label="Resultado Pericia"
                    value={personaDetalle.resultadoPericia}
                    full
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setPersonaDetalle(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {personaEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="p-5 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                <IconTrash className="h-6 w-6 text-danger" />
              </div>
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Eliminar Persona Jurídica
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                ¿Está seguro que desea eliminar{' '}
                <strong>{personaEliminar.nombreRazonSocial}</strong>? Esta acción
                no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-center gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setPersonaEliminar(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => eliminarPersona(personaEliminar)}
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
