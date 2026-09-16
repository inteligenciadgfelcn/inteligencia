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
import IconEdit from '@/components/Icon/IconEdit'
import IconTrash from '@/components/Icon/IconTrash'
import IconEye from '@/components/Icon/IconEye'

import { PersonasJuridicasApi } from '../api/personas-juridicas.api'
import { ActuacionesApi } from '../api/actuaciones.api'
import type { ActuacionRow } from '../types/actuaciones.types'
import type {
  PersonaJuridicaRow,
  TipoSituacionJuridicaEmpresa,
  TipoVinculo,
  Vinculo,
} from '../types/personas-juridicas.types'
import { VALORES_POR_DEFECTO } from '../types/personas-juridicas.types'
import { formatFecha } from '../../utils/fechas'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  { ssr: false }
)

type Props = {
  casoId: number
}

type FormState = typeof VALORES_POR_DEFECTO

export function PersonasJuridicas({ casoId }: Props) {
  const [vista, setVista] = useState<'lista' | 'formulario'>('lista')
  const [personaEditando, setPersonaEditando] =
    useState<PersonaJuridicaRow | null>(null)
  const [personaDetalle, setPersonaDetalle] =
    useState<PersonaJuridicaRow | null>(null)
  const [personaEliminar, setPersonaEliminar] =
    useState<PersonaJuridicaRow | null>(null)
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

  const { data: empresasData, isLoading: empresasLoading } = useQuery({
    queryKey: ['lgi-personas-juridicas', opId, page, limit],
    enabled: Boolean(opId),
    queryFn: () =>
      PersonasJuridicasApi.listarPorOperativo(opId!, {
        pagina: page,
        limite: limit,
      }),
  })

  const { data: vinculos = [] } = useQuery<Vinculo[]>({
    queryKey: ['lgi-personas-juridicas', 'vinculos'],
    queryFn: () => PersonasJuridicasApi.listarVinculos(),
  })

  const { data: tiposSituacion = [] } = useQuery<
    TipoSituacionJuridicaEmpresa[]
  >({
    queryKey: ['lgi-personas-juridicas', 'tipos-situacion'],
    queryFn: () => PersonasJuridicasApi.listarTiposSituacionJuridicaEmpresa(),
  })

  const { data: tiposVinculo = [] } = useQuery<TipoVinculo[]>({
    queryKey: ['lgi-personas-juridicas', 'tipos-vinculo', form.idVinculo],
    enabled: Boolean(form.idVinculo),
    queryFn: () => PersonasJuridicasApi.listarTiposVinculo(form.idVinculo),
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

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const abrirCrear = () => {
    setPersonaEditando(null)
    setForm({ ...VALORES_POR_DEFECTO })
    setCoordenadas(null)
    setMensaje(null)
    setVista('formulario')
  }

  const abrirEditar = (persona: PersonaJuridicaRow) => {
    setPersonaEditando(persona)
    setForm({
      ...VALORES_POR_DEFECTO,
      nombre: persona.nombre,
      nit: persona.nit,
      matricula: persona.matricula,
      representante: persona.representante,
      observaciones: persona.observaciones ?? '',
      propietarioSocio: persona.propietarioSocio ?? '',
      beneficiariosFinales: persona.beneficiariosFinales ?? '',
      capitalSocial: persona.capitalSocial ?? '',
      direccion: persona.direccion ?? '',
      latitud: persona.latitud != null ? Number(persona.latitud) : null,
      longitud: persona.longitud != null ? Number(persona.longitud) : null,
      idVinculo: persona.tipoVinculo?.vinculo?.idVinculo ?? 0,
      idTipoVinculo: persona.idTipoVinculo != null ? Number(persona.idTipoVinculo) : 0,
      pericia: persona.pericia,
      resultado: persona.resultado ?? '',
    })
    setCoordenadas(
      persona.latitud != null && persona.longitud != null
        ? [Number(persona.latitud), Number(persona.longitud)]
        : null
    )
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

  const isFormValid =
    Boolean(opId) &&
    form.nombre.trim() !== '' &&
    form.nit.trim() !== '' &&
    form.matricula.trim() !== '' &&
    form.representante.trim() !== '' &&
    form.direccion.trim() !== '' &&
    form.latitud != null &&
    form.longitud != null &&
    form.idVinculo > 0 &&
    form.idTipoVinculo > 0 &&
    form.idTipoSituacionJuridica > 0 &&
    form.fecha !== '' &&
    form.quienAutoriza.trim() !== '' &&
    form.aQuienEntregan.trim() !== '' &&
    (!form.pericia || form.resultado.trim() !== '')

  const construirFormData = (): FormData => {
    const fd = new FormData()
    fd.append('opId', String(opId))
    fd.append('nombre', form.nombre)
    fd.append('nit', form.nit)
    fd.append('matricula', form.matricula)
    fd.append('representante', form.representante)
    if (form.observaciones) fd.append('observaciones', form.observaciones)
    if (form.propietarioSocio) fd.append('propietarioSocio', form.propietarioSocio)
    if (form.beneficiariosFinales)
      fd.append('beneficiariosFinales', form.beneficiariosFinales)
    if (form.capitalSocial) fd.append('capitalSocial', String(form.capitalSocial))
    fd.append('direccion', form.direccion)
    if (form.latitud != null) fd.append('latitud', String(form.latitud))
    if (form.longitud != null) fd.append('longitud', String(form.longitud))
    fd.append('idTipoVinculo', String(form.idTipoVinculo))
    fd.append('pericia', String(form.pericia))
    if (form.resultado) fd.append('resultado', form.resultado)
    if (form.imagen) fd.append('imagen', form.imagen)
    if (form.documento) fd.append('documento', form.documento)
    return fd
  }

  const onSubmit = async () => {
    if (!isFormValid || !opId) return
    setGuardando(true)
    setMensaje(null)
    try {
      const fd = construirFormData()
      const empresa = personaEditando
        ? await PersonasJuridicasApi.actualizarPersonaJuridica(
            Number(personaEditando.empId),
            fd
          )
        : await PersonasJuridicasApi.crearPersonaJuridica(fd)

      const empId = Number(empresa?.empId)

      await PersonasJuridicasApi.registrarSituacionJuridicaEmpresa({
        idEmpresa: empId,
        fecha: form.fecha,
        quienAutoriza: form.quienAutoriza,
        aQuienEntregan: form.aQuienEntregan,
        idTipoSituacionJuridica: form.idTipoSituacionJuridica,
      })

      setVista('lista')
      setPersonaEditando(null)
      setMensaje(
        personaEditando
          ? 'Persona jurídica actualizada correctamente'
          : 'Persona jurídica registrada correctamente'
      )
      setPage(1)
    } catch {
      setMensaje('Error al guardar la persona jurídica. Intente nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminar = async () => {
    if (!personaEliminar) return
    try {
      await PersonasJuridicasApi.eliminarPersonaJuridica(
        Number(personaEliminar.empId)
      )
      setPersonaEliminar(null)
      setMensaje('Persona jurídica eliminada correctamente')
    } catch {
      setMensaje('Error al eliminar la persona jurídica.')
    }
  }

  const option = (value: string | number, label: string) => ({
    value: String(value),
    label,
  })

  const columns: Column<PersonaJuridicaRow>[] = [
    { accessor: 'nombre', title: 'Nombre / Razón Social' },
    { accessor: 'nit', title: 'NIT' },
    { accessor: 'matricula', title: 'Matrícula' },
    {
      accessor: 'tipoVinculo',
      title: 'Vínculo',
      render: (row) => row.tipoVinculo?.descripcion ?? '-',
    },
    {
      accessor: 'ultimaSituacionJuridica',
      title: 'Situación Jurídica',
      render: (row) => row.ultimaSituacionJuridica?.descripcionTipo ?? '-',
    },
    {
      accessor: 'pericia',
      title: 'Pericia',
      render: (row) => (row.pericia ? 'Sí' : 'No'),
    },
    {
      accessor: 'empId',
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
            disabled={guardando}
          >
            ← Volver
          </Button>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            {personaEditando
              ? 'Editar Persona Jurídica'
              : 'Registrar Persona Jurídica'}
          </h6>
        </div>

        <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <span className="font-semibold">Actuación seleccionada: </span>
          {actuaciones.find((a) => String(a.opId) === String(opId))?.opNrooper ??
            'Sin seleccionar'}
          {opId ? ` (opId ${opId})` : ''}
        </div>

        <div className="panel space-y-6 p-5">
          <Fieldset title="Datos Generales">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Nombre o Razón Social *
                </label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setField('nombre', e.target.value)}
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
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Matrícula *
                </label>
                <Input
                  value={form.matricula}
                  onChange={(e) => setField('matricula', e.target.value)}
                  placeholder="MAT-2020-001234"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Representante Legal *
                </label>
                <Input
                  value={form.representante}
                  onChange={(e) => setField('representante', e.target.value)}
                  placeholder="Nombre del representante legal"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Observaciones
              </label>
              <textarea
                className="form-textarea w-full"
                rows={2}
                value={form.observaciones}
                onChange={(e) => setField('observaciones', e.target.value)}
                placeholder="Observaciones..."
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
                  value={form.propietarioSocio}
                  onChange={(e) => setField('propietarioSocio', e.target.value)}
                  placeholder="Nombre y porcentaje de participación..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Beneficiario(s) Final(es)
                </label>
                <textarea
                  className="form-textarea w-full"
                  rows={2}
                  value={form.beneficiariosFinales}
                  onChange={(e) =>
                    setField('beneficiariosFinales', e.target.value)
                  }
                  placeholder="Beneficiarios finales de la empresa..."
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Capital Social">
            <div className="max-w-xs">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Capital Social (BOB)
              </label>
              <Input
                type="number"
                value={form.capitalSocial || ''}
                onChange={(e) => setField('capitalSocial', e.target.value)}
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
            </div>
          </Fieldset>

          <Fieldset title="Vínculo">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  options={tiposVinculo.map((t) =>
                    option(t.idTipoVinculo, t.descripcion)
                  )}
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
                      resultado: val ? prev.resultado : '',
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
                    value={form.resultado}
                    onChange={(e) => setField('resultado', e.target.value)}
                    placeholder="Describa el resultado de la pericia..."
                  />
                </div>
              )}
            </div>
          </Fieldset>

          <Fieldset title="Situación jurídica">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo de situación *
                </label>
                <Select
                  options={tiposSituacion.map((t) =>
                    option(t.idTipoSituacionJuridica, t.descripcion)
                  )}
                  placeholder="Seleccione tipo de situación"
                  value={
                    form.idTipoSituacionJuridica
                      ? String(form.idTipoSituacionJuridica)
                      : ''
                  }
                  onChange={(e) =>
                    setField('idTipoSituacionJuridica', Number(e.target.value))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Fecha *
                </label>
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setField('fecha', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Quién autoriza *
                </label>
                <Input
                  value={form.quienAutoriza}
                  onChange={(e) => setField('quienAutoriza', e.target.value)}
                  placeholder="Persona o autoridad que autoriza"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  A quién entregan *
                </label>
                <Input
                  value={form.aQuienEntregan}
                  onChange={(e) => setField('aQuienEntregan', e.target.value)}
                  placeholder="Persona o institución a quien se entrega"
                />
              </div>
            </div>
          </Fieldset>

          <Fieldset title="Archivos">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Imagen (JPG/PNG/WEBP)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full text-sm"
                  onChange={(e) =>
                    setField('imagen', e.target.files?.[0] ?? null)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Documento (PDF/JPG/PNG/WEBP)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  className="block w-full text-sm"
                  onChange={(e) =>
                    setField('documento', e.target.files?.[0] ?? null)
                  }
                />
              </div>
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
          disabled={!opId}
        >
          <IconPlus className="h-4 w-4" />
          Nueva Persona Jurídica
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
          options={actuaciones.map((a) =>
            option(
              a.opId,
              `${a.opNrooper} (${formatFecha(a.opFechainf, 'dd/MM/yyyy')})`
            )
          )}
          placeholder="Seleccione la actuación"
          value={opId != null ? String(opId) : ''}
          onChange={(e) => {
            setOpId(Number(e.target.value) || null)
            setPage(1)
          }}
        />
        <p className="mt-1 text-xs text-gray-500">
          Seleccione la actuación para listar o registrar las personas jurídicas
          asociadas.
        </p>
      </div>

      {opId == null ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-gray-500">
            Seleccione una actuación para ver sus personas jurídicas.
          </p>
        </div>
      ) : (
        <VristoDataTable<PersonaJuridicaRow>
          title="Personas Jurídicas"
          rows={empresasData?.filas ?? []}
          total={empresasData?.total ?? 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
          loading={empresasLoading}
        />
      )}

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
                <DetalleCampo label="Nombre / Razón Social" value={personaDetalle.nombre} full />
                <DetalleCampo label="NIT" value={personaDetalle.nit} />
                <DetalleCampo label="Matrícula" value={personaDetalle.matricula} />
                <DetalleCampo label="Representante Legal" value={personaDetalle.representante} />
                <DetalleCampo label="Capital Social" value={personaDetalle.capitalSocial} />
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
                  label="Vínculo"
                  value={personaDetalle.tipoVinculo?.descripcion}
                />
                <DetalleCampo label="Pericia" value={personaDetalle.pericia ? 'Sí' : 'No'} />
                {personaDetalle.pericia && (
                  <DetalleCampo label="Resultado Pericia" value={personaDetalle.resultado} full />
                )}
                <DetalleCampo
                  label="Situación Jurídica"
                  value={personaDetalle.ultimaSituacionJuridica?.descripcionTipo}
                />
                <DetalleCampo
                  label="Fecha Situación"
                  value={formatFecha(personaDetalle.ultimaSituacionJuridica?.fecha, 'dd/MM/yyyy')}
                />
              </div>
              {personaDetalle.propietarioSocio && (
                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Propietario(s) / Socio(s)
                  </p>
                  <p className="text-sm text-dark dark:text-white-light">
                    {personaDetalle.propietarioSocio}
                  </p>
                </div>
              )}
              {personaDetalle.beneficiariosFinales && (
                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Beneficiario(s) Final(es)
                  </p>
                  <p className="text-sm text-dark dark:text-white-light">
                    {personaDetalle.beneficiariosFinales}
                  </p>
                </div>
              )}
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
                <strong>{personaEliminar.nombre}</strong>? Esta acción no se puede
                deshacer.
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