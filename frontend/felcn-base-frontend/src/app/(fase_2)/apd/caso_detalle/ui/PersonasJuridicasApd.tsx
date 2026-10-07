'use client'

import { useRef, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import type { Map as LeafletMap } from 'leaflet'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconPlus from '@/components/Icon/IconPlus'
import IconEdit from '@/components/Icon/IconEdit'
import IconTrash from '@/components/Icon/IconTrash'
import IconEye from '@/components/Icon/IconEye'
import { BuscadorDireccion } from '@/components/mapas/BuscadorDireccion'

import { PersonasJuridicasApi } from '../api/personas-juridicas-apd.api'
import { ImplicadoLgiApi } from '../api/implicado-lgi-apd.api'
import { ActuacionesApi } from '../api/actuaciones-apd.api'
import type { ActuacionRow } from '../types/actuaciones-apd.types'
import type {
  ImplicadoPayload,
  ImplicadoRow,
  TipoDocumentoLgi,
  TipoImplicado,
} from '../types/implicado-lgi-apd.types'
import { IMPLICADO_POR_DEFECTO } from '../types/implicado-lgi-apd.types'
import type {
  PersonaJuridicaRow,
  TipoSituacionJuridicaEmpresa,
  Vinculo,
} from '../types/personas-juridicas-apd.types'
import {
  SITUACION_POR_DEFECTO,
  VALORES_POR_DEFECTO,
} from '../types/personas-juridicas-apd.types'
import { formatFecha } from '../../utils/fechas-apd'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  { ssr: false }
)

type Props = {
  casoId: number
}

type FormState = typeof VALORES_POR_DEFECTO
type SituacionState = typeof SITUACION_POR_DEFECTO
type ImplicadoFormState = typeof IMPLICADO_POR_DEFECTO

const apellidosDe = (fila: ImplicadoRow) =>
  [fila.apellidoPaterno, fila.apellidoMaterno, fila.apellidoEsposo]
    .filter(Boolean)
    .join(' ')
    .trim() || '-'

export function PersonasJuridicas({ casoId }: Props) {
  const queryClient = useQueryClient()

  const [vista, setVista] = useState<'lista' | 'formulario'>('lista')
  const [personaEditando, setPersonaEditando] =
    useState<PersonaJuridicaRow | null>(null)
  const [personaDetalle, setPersonaDetalle] =
    useState<PersonaJuridicaRow | null>(null)
  const [personaEliminar, setPersonaEliminar] =
    useState<PersonaJuridicaRow | null>(null)
  const [mapaOpen, setMapaOpen] = useState(false)
  const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null)
  const [centroMapa, setCentroMapa] = useState<[number, number] | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [mensajeError, setMensajeError] = useState(false)

  const [opId, setOpId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [form, setForm] = useState<FormState>({ ...VALORES_POR_DEFECTO })

  // Disponible cuando los datos generales ya fueron guardados (card 1).
  const [empresaId, setEmpresaId] = useState<number | null>(null)

  // Card 3: vínculo con la investigación.
  const [situacion, setSituacion] = useState<SituacionState>({
    ...SITUACION_POR_DEFECTO,
  })
  const [guardandoSituacion, setGuardandoSituacion] = useState(false)

  // Card 2: beneficiarios finales (CRUD).
  const [modalImplicado, setModalImplicado] = useState(false)
  const [implicadoEditando, setImplicadoEditando] =
    useState<ImplicadoRow | null>(null)
  const [implicadoForm, setImplicadoForm] = useState<ImplicadoFormState>({
    ...IMPLICADO_POR_DEFECTO,
  })
  const [implicadoEliminar, setImplicadoEliminar] =
    useState<ImplicadoRow | null>(null)
  const [guardandoImplicado, setGuardandoImplicado] = useState(false)
  const [impPage, setImpPage] = useState(1)
  const [impLimit, setImpLimit] = useState(10)

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

  const {
    data: empresasData,
    isLoading: empresasLoading,
    isFetching: empresasFetching,
  } = useQuery({
    queryKey: ['apd-personas-juridicas', opId, page, limit],
    enabled: Boolean(opId),
    queryFn: () =>
      PersonasJuridicasApi.listarPorOperativo(opId!, {
        pagina: page,
        limite: limit,
      }),
  })

  const refrescarEmpresas = () =>
    queryClient.invalidateQueries({
      queryKey: ['apd-personas-juridicas', opId],
    })

  const { data: vinculos = [] } = useQuery<Vinculo[]>({
    queryKey: ['apd-personas-juridicas', 'vinculos'],
    queryFn: () => PersonasJuridicasApi.listarVinculosPersonaJuridica(),
  })

  const { data: tiposSituacion = [] } = useQuery<
    TipoSituacionJuridicaEmpresa[]
  >({
    queryKey: ['apd-personas-juridicas', 'tipos-situacion'],
    queryFn: () => PersonasJuridicasApi.listarTiposSituacionJuridicaEmpresa(),
  })

  const { data: tiposImplicado = [] } = useQuery<TipoImplicado[]>({
    queryKey: ['apd-personas-juridicas', 'tipos-implicado'],
    queryFn: () => ImplicadoLgiApi.listarTiposImplicado(),
  })

  const { data: tiposDocumento = [] } = useQuery<TipoDocumentoLgi[]>({
    queryKey: ['apd-personas-juridicas', 'tipos-documento'],
    queryFn: () => ImplicadoLgiApi.listarTiposDocumento(),
  })

  const {
    data: implicados = [],
    isLoading: implicadosLoading,
    isFetching: implicadosFetching,
  } = useQuery<ImplicadoRow[]>({
    queryKey: ['apd-implicados', opId, empresaId],
    enabled: vista === 'formulario' && opId != null && empresaId != null,
    queryFn: () =>
      ImplicadoLgiApi.listarPorOperativoYEmpresa(opId!, empresaId!),
  })

  // La paginación de beneficiarios se resuelve en el cliente porque el
  // endpoint devuelve un arreglo simple (sin total/filas).
  useEffect(() => {
    const maximaPagina = Math.max(1, Math.ceil(implicados.length / impLimit))
    if (impPage > maximaPagina) setImpPage(maximaPagina)
  }, [implicados.length, impLimit, impPage])

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
    setSituacion({ ...SITUACION_POR_DEFECTO })
    setEmpresaId(null)
    setCoordenadas(null)
    setCentroMapa(null)
    setMensaje(null)
    setMensajeError(false)
    setImpPage(1)
    setVista('formulario')
  }

  const abrirEditar = (persona: PersonaJuridicaRow) => {
    setPersonaEditando(persona)
    setEmpresaId(Number(persona.empId))
    setForm({
      ...VALORES_POR_DEFECTO,
      nombre: persona.nombre,
      nit: persona.nit,
      matricula: persona.matricula,
      representante: persona.representante,
      observaciones: persona.observaciones ?? '',
      capitalSocial: persona.capitalSocial ?? '',
      direccion: persona.direccion ?? '',
      latitud: persona.latitud != null ? Number(persona.latitud) : null,
      longitud: persona.longitud != null ? Number(persona.longitud) : null,
      idVinculo: persona.idVinculo != null ? Number(persona.idVinculo) : 0,
      pericia: persona.pericia,
      resultado: persona.resultado ?? '',
    })
    setSituacion({
      fecha: persona.ultimaSituacionJuridica?.fecha?.slice(0, 10) ?? '',
      idTipoSituacionJuridica:
        Number(persona.ultimaSituacionJuridica?.idTipoSituacionJuridica ?? 0) ||
        0,
    })
    setCoordenadas(
      persona.latitud != null && persona.longitud != null
        ? [Number(persona.latitud), Number(persona.longitud)]
        : null
    )
    setMensaje(null)
    setMensajeError(false)
    setImpPage(1)
    setVista('formulario')
  }

  const abrirMapa = () => {
    setCentroMapa(coordenadas)
    setMapaOpen(true)
  }

  const confirmarMapa = () => {
    if (!coordenadas && mapRef.current) {
      const center = mapRef.current.getCenter()
      setCoordenadas([center.lat, center.lng])
    }
    setMapaOpen(false)
  }

  const handleMapClick = (center: [number, number]) => {
    setCoordenadas(center)
  }

  const notificar = (texto: string, esError = false) => {
    setMensaje(texto)
    setMensajeError(esError)
  }

  /* ------------------------------------------------------------------ */
  /* Card 1 - Datos generales                                           */
  /* ------------------------------------------------------------------ */

  const isFormValid =
    Boolean(opId) &&
    form.nombre.trim() !== '' &&
    form.nit.trim() !== '' &&
    form.matricula.trim() !== '' &&
    form.representante.trim() !== '' &&
    form.observaciones.trim() !== '' &&
    form.idVinculo > 0 &&
    (!form.pericia || form.resultado.trim() !== '')

  const construirFormData = (): FormData => {
    const fd = new FormData()
    fd.append('opId', String(opId))
    fd.append('nombre', form.nombre)
    fd.append('nit', form.nit)
    fd.append('matricula', form.matricula)
    fd.append('representante', form.representante)
    fd.append('observaciones', form.observaciones)
    if (form.capitalSocial)
      fd.append('capitalSocial', String(form.capitalSocial))
    if (form.direccion) fd.append('direccion', form.direccion)
    if (form.latitud != null) fd.append('latitud', String(form.latitud))
    if (form.longitud != null) fd.append('longitud', String(form.longitud))
    fd.append('idVinculo', String(form.idVinculo))
    fd.append('pericia', String(form.pericia))
    if (form.resultado) fd.append('resultado', form.resultado)
    if (form.imagen) fd.append('imagen', form.imagen)
    if (form.documento) fd.append('documento', form.documento)
    return fd
  }

  const guardarDatosGenerales = async () => {
    if (!isFormValid || !opId || guardando) return
    setGuardando(true)
    setMensaje(null)
    setMensajeError(false)
    try {
      const fd = construirFormData()
      const empresa = personaEditando
        ? await PersonasJuridicasApi.actualizarPersonaJuridica(
          Number(personaEditando.empId),
          fd
        )
        : await PersonasJuridicasApi.crearPersonaJuridica(fd)

      const empId = Number(empresa?.empId)
      if (!(empId > 0)) {
        throw new Error('Respuesta sin identificador de empresa')
      }

      setEmpresaId(empId)
      setPersonaEditando(empresa)
      notificar(
        personaEditando
          ? 'Datos generales actualizados correctamente'
          : 'Datos generales guardados correctamente'
      )
      await refrescarEmpresas()
    } catch {
      notificar(
        'Error al guardar los datos generales. Intente nuevamente.',
        true
      )
    } finally {
      setGuardando(false)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Card 2 - Beneficiarios finales                                     */
  /* ------------------------------------------------------------------ */

  const esValidoImplicado =
    implicadoForm.nombres.trim() !== '' &&
    implicadoForm.tipoImplicadoId !== '' &&
    implicadoForm.tipoDocumentoId !== '' &&
    implicadoForm.numeroDocumento.trim() !== ''

  const abrirModalImplicado = (fila?: ImplicadoRow) => {
    setImplicadoEditando(fila ?? null)
    setImplicadoForm(
      fila
        ? {
          nombres: fila.nombres ?? '',
          apellidoPaterno: fila.apellidoPaterno ?? '',
          apellidoMaterno: fila.apellidoMaterno ?? '',
          apellidoEsposo: fila.apellidoEsposo ?? '',
          tipoImplicadoId: fila.tipoImplicadoId ?? '',
          tipoDocumentoId: fila.tipoDocumentoId ?? '',
          numeroDocumento: fila.numeroDocumento ?? '',
        }
        : { ...IMPLICADO_POR_DEFECTO }
    )
    setMensaje(null)
    setModalImplicado(true)
  }

  const guardarImplicado = async () => {
    if (!esValidoImplicado || !opId || !empresaId || guardandoImplicado) return
    setGuardandoImplicado(true)
    try {
      const payload: ImplicadoPayload = {
        operativoId: String(opId),
        tipoImplicadoId: implicadoForm.tipoImplicadoId,
        nombres: implicadoForm.nombres.trim(),
        apellidoPaterno: implicadoForm.apellidoPaterno.trim(),
        apellidoMaterno: implicadoForm.apellidoMaterno.trim(),
        apellidoEsposo: implicadoForm.apellidoEsposo.trim(),
        tipoDocumentoId: implicadoForm.tipoDocumentoId,
        numeroDocumento: implicadoForm.numeroDocumento.trim(),
        empresaId,
      }

      if (implicadoEditando) {
        await ImplicadoLgiApi.actualizarImplicado(implicadoEditando.id, payload)
      } else {
        await ImplicadoLgiApi.crearImplicado(payload)
      }

      await queryClient.invalidateQueries({
        queryKey: ['apd-implicados', opId, empresaId],
      })
      setModalImplicado(false)
      notificar(
        implicadoEditando
          ? 'Beneficiario final actualizado correctamente'
          : 'Beneficiario final registrado correctamente'
      )
    } catch {
      notificar(
        'Error al guardar el beneficiario final. Intente nuevamente.',
        true
      )
    } finally {
      setGuardandoImplicado(false)
    }
  }

  const confirmarEliminarImplicado = async () => {
    if (!implicadoEliminar || !opId || !empresaId) return
    try {
      await ImplicadoLgiApi.eliminarImplicado(implicadoEliminar.id)
      setImplicadoEliminar(null)
      await queryClient.invalidateQueries({
        queryKey: ['apd-implicados', opId, empresaId],
      })
      notificar('Beneficiario final eliminado correctamente')
    } catch {
      notificar(
        'Error al eliminar el beneficiario final. Intente nuevamente.',
        true
      )
    }
  }

  /* ------------------------------------------------------------------ */
  /* Card 3 - Vínculo con la investigación                               */
  /* ------------------------------------------------------------------ */

  const esValidoSituacion =
    Boolean(empresaId) &&
    Boolean(opId) &&
    situacion.idTipoSituacionJuridica > 0 &&
    situacion.fecha !== ''

  const guardarSituacion = async () => {
    if (!esValidoSituacion || !empresaId || guardandoSituacion) return
    setGuardandoSituacion(true)
    setMensaje(null)
    setMensajeError(false)
    try {
      await PersonasJuridicasApi.registrarSituacionJuridicaEmpresa({
        idEmpresa: empresaId,
        fecha: situacion.fecha,
        idTipoSituacionJuridica: situacion.idTipoSituacionJuridica,
      })

      // El banner de la última situación se deriva de personaEditando, que es
      // una instantánea: se refresca para que refleje el registro recién hecho.
      const descripcionTipo = tiposSituacion.find(
        (t) =>
          Number(t.idTipoSituacionJuridica) ===
          situacion.idTipoSituacionJuridica
      )?.descripcion
      setPersonaEditando((prev) =>
        prev
          ? {
            ...prev,
            ultimaSituacionJuridica: {
              ...prev.ultimaSituacionJuridica,
              idEmpresa: String(empresaId),
              fecha: situacion.fecha,
              idTipoSituacionJuridica: String(
                situacion.idTipoSituacionJuridica
              ),
              descripcionTipo: descripcionTipo ?? '',
            },
          }
          : prev
      )

      notificar('Vínculo con la investigación registrado correctamente')
      await refrescarEmpresas()
    } catch {
      notificar(
        'Error al registrar el vínculo con la investigación. Intente nuevamente.',
        true
      )
    } finally {
      setGuardandoSituacion(false)
    }
  }

  const confirmarEliminar = async () => {
    if (!personaEliminar) return
    try {
      await PersonasJuridicasApi.eliminarPersonaJuridica(
        Number(personaEliminar.empId)
      )
      setPersonaEliminar(null)
      if (personaDetalle?.empId === personaEliminar.empId) {
        setPersonaDetalle(null)
      }
      notificar('Persona jurídica eliminada correctamente')

      // Si se borró la única fila de una página anterior, la página quedó fuera
      // de rango (VristoDataTable no la recorta): se retrocede una página. En los
      // demás casos se refresca la página actual.
      if ((empresasData?.filas?.length ?? 0) <= 1 && page > 1) {
        setPage(page - 1)
      } else {
        await refrescarEmpresas()
      }
    } catch {
      notificar('Error al eliminar la persona jurídica.', true)
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
      accessor: 'vinculo',
      title: 'Vínculo',
      render: (row) => row.vinculo?.descripcion ?? '-',
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
          {/* <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="!p-1.5"
            title="Editar"
            onClick={() => abrirEditar(row)}
          >
            <IconEdit className="h-4 w-4" />
          </Button> */}
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

  const columnasImplicados: Column<ImplicadoRow>[] = [
    { accessor: 'nombres', title: 'Nombres' },
    { accessor: 'apellidoPaterno', title: 'Apellidos', render: apellidosDe },
    {
      accessor: 'tipoImplicadoId',
      title: 'Tipo de implicado',
      render: (fila) =>
        tiposImplicado.find(
          (t) => String(t.idTipoImplicado) === String(fila.tipoImplicadoId)
        )?.descripcion ?? String(fila.tipoImplicadoId || '-'),
    },
    {
      accessor: 'tipoDocumentoId',
      title: 'Tipo de documento',
      render: (fila) =>
        tiposDocumento.find(
          (d) => String(d.td_id) === String(fila.tipoDocumentoId)
        )?.descripcion ?? String(fila.tipoDocumentoId || '-'),
    },
    { accessor: 'numeroDocumento', title: 'N° Documento' },
    {
      accessor: 'id',
      title: 'Acciones',
      render: (fila) => (
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            className="!p-1.5"
            title="Editar beneficiario"
            onClick={() => abrirModalImplicado(fila)}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="!p-1.5"
            title="Eliminar beneficiario"
            onClick={() => setImplicadoEliminar(fila)}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const implicadosPaginados = implicados.slice(
    (impPage - 1) * impLimit,
    impPage * impLimit
  )

  if (vista === 'formulario') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setVista('lista')}
            disabled={guardando || guardandoSituacion}
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
          {actuaciones.find((a) => String(a.opId) === String(opId))
            ?.opNrooper ?? 'Sin seleccionar'}
          {opId ? ` (opId ${opId})` : ''}
        </div>

        {mensaje && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${mensajeError
              ? 'border-danger/30 bg-danger/5 text-danger'
              : 'border-success/30 bg-success/5 text-success'
              }`}
          >
            {mensaje}
          </div>
        )}

        <Card title="Datos generales">
          <div className="space-y-6">
            <Fieldset title="Identificación">
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
                  Observaciones *
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

            <Fieldset title="Capital social">
              <div className="max-w-xs">
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Capital Social (USD)
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
                  Dirección
                </label>
                <Input
                  value={form.direccion}
                  onChange={(e) => setField('direccion', e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Coordenadas
                </label>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-500">
                          Latitud
                        </label>
                        <Input
                          value={
                            form.latitud != null ? String(form.latitud) : ''
                          }
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
                          value={
                            form.longitud != null ? String(form.longitud) : ''
                          }
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

            <Fieldset title="Pericia">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    ¿Se realizó pericia?
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
                      Resultado de la pericia
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

            <Fieldset title="Vínculo">
              <div className="max-w-md">
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Vínculo con la empresa *
                </label>
                <Select
                  options={vinculos.map((v) =>
                    option(v.idVinculo, v.descripcion)
                  )}
                  placeholder="Seleccione vínculo"
                  value={form.idVinculo ? String(form.idVinculo) : ''}
                  onChange={(e) =>
                    setField('idVinculo', Number(e.target.value) || 0)
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  Investigada con responsabilidad penal, o
                  identificada/intervenida.
                </p>
              </div>
            </Fieldset>

            <Fieldset title="Archivos">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Documento de respaldo (PDF/JPG/PNG/WEBP)
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
              </div>
            </Fieldset>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="primary"
                loading={guardando}
                disabled={!isFormValid}
                onClick={guardarDatosGenerales}
              >
                {personaEditando
                  ? 'Actualizar datos generales'
                  : 'Guardar datos generales'}
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Beneficiarios finales">
          {empresaId == null ? (
            <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
              Guarde primero los datos generales para registrar los
              beneficiarios finales.
            </div>
          ) : (
            <VristoDataTable<ImplicadoRow>
              rows={implicadosPaginados}
              total={implicados.length}
              page={impPage}
              limit={impLimit}
              onPageChange={setImpPage}
              onLimitChange={(l) => {
                setImpLimit(l)
                setImpPage(1)
              }}
              columns={columnasImplicados}
              loading={implicadosLoading || implicadosFetching}
              extraButtons={
                <Button
                  type="button"
                  variant="primary"
                  className="gap-2"
                  onClick={() => abrirModalImplicado()}
                >
                  <IconPlus className="h-4 w-4" />
                  Agregar beneficiario
                </Button>
              }
            />
          )}
        </Card>

        <Card title="Vínculo con la investigación">
          <div className="space-y-4">
            {empresaId == null && (
              <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                Guarde primero los datos generales para registrar el vínculo con
                la investigación.
              </div>
            )}

            {personaEditando?.ultimaSituacionJuridica && (
              <div className="rounded-md border border-gray-200 px-4 py-3 text-sm dark:border-[#1b2e4b]">
                <span className="font-semibold">
                  Última situación registrada:{' '}
                </span>
                {personaEditando.ultimaSituacionJuridica.descripcionTipo ?? '-'}
                {personaEditando.ultimaSituacionJuridica.fecha
                  ? ` (${formatFecha(
                    personaEditando.ultimaSituacionJuridica.fecha,
                    'dd/MM/yyyy'
                  )})`
                  : ''}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Tipo de situación jurídica *
                </label>
                <Select
                  options={tiposSituacion.map((t) =>
                    option(t.idTipoSituacionJuridica, t.descripcion)
                  )}
                  placeholder="Seleccione tipo de situación"
                  value={
                    situacion.idTipoSituacionJuridica
                      ? String(situacion.idTipoSituacionJuridica)
                      : ''
                  }
                  disabled={empresaId == null}
                  onChange={(e) =>
                    setSituacion((prev) => ({
                      ...prev,
                      idTipoSituacionJuridica: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                  Fecha *
                </label>
                <Input
                  type="date"
                  value={situacion.fecha}
                  disabled={empresaId == null}
                  onChange={(e) =>
                    setSituacion((prev) => ({
                      ...prev,
                      fecha: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Investigado · Imputado · Acusado · Rechazado · Sobreseido ·
              Absuelto · Condenado
            </p>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="primary"
                loading={guardandoSituacion}
                disabled={!esValidoSituacion}
                onClick={guardarSituacion}
              >
                Registrar vínculo
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => setVista('lista')}
            disabled={guardando || guardandoSituacion}
          >
            Cancelar
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
                <BuscadorDireccion
                  autoFocus
                  className="mb-3"
                  onSeleccionar={(coords) => {
                    setCoordenadas(coords)
                    mapRef.current?.flyTo(coords, 16)
                  }}
                />
                <MapaConMarcador
                  id="mapa-pj"
                  mapRef={mapRef}
                  centro={centroMapa ?? undefined}
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

        {modalImplicado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
                <h3 className="text-lg font-bold text-dark dark:text-white-light">
                  {implicadoEditando
                    ? 'Editar beneficiario final'
                    : 'Agregar beneficiario final'}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setModalImplicado(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Nombres *
                    </label>
                    <Input
                      value={implicadoForm.nombres}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          nombres: e.target.value,
                        }))
                      }
                      placeholder="Nombres"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Número de documento *
                    </label>
                    <Input
                      value={implicadoForm.numeroDocumento}
                      maxLength={15}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          numeroDocumento: e.target.value,
                        }))
                      }
                      placeholder="1234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Apellido paterno
                    </label>
                    <Input
                      value={implicadoForm.apellidoPaterno}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          apellidoPaterno: e.target.value,
                        }))
                      }
                      placeholder="Pérez"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Apellido materno
                    </label>
                    <Input
                      value={implicadoForm.apellidoMaterno}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          apellidoMaterno: e.target.value,
                        }))
                      }
                      placeholder="Mamani"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Apellido de casado/a
                    </label>
                    <Input
                      value={implicadoForm.apellidoEsposo}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          apellidoEsposo: e.target.value,
                        }))
                      }
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Tipo de implicado *
                    </label>
                    <Select
                      options={tiposImplicado.map((t) =>
                        option(t.idTipoImplicado, t.descripcion)
                      )}
                      placeholder="Seleccione tipo"
                      value={implicadoForm.tipoImplicadoId}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          tipoImplicadoId: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                      Tipo de documento *
                    </label>
                    <Select
                      options={tiposDocumento.map((d) =>
                        option(d.td_id, d.descripcion)
                      )}
                      placeholder="Seleccione tipo de documento"
                      value={implicadoForm.tipoDocumentoId}
                      onChange={(e) =>
                        setImplicadoForm((prev) => ({
                          ...prev,
                          tipoDocumentoId: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Empresa asociada:{' '}
                  <span className="font-semibold">#{empresaId}</span>
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setModalImplicado(false)}
                  disabled={guardandoImplicado}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  loading={guardandoImplicado}
                  disabled={!esValidoImplicado}
                  onClick={guardarImplicado}
                >
                  {implicadoEditando ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {implicadoEliminar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
              <div className="p-5 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                  <IconTrash className="h-6 w-6 text-danger" />
                </div>
                <h3 className="text-lg font-bold text-dark dark:text-white-light">
                  Eliminar Beneficiario Final
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  ¿Está seguro que desea eliminar{' '}
                  <strong>
                    {implicadoEliminar.nombres} {apellidosDe(implicadoEliminar)}
                  </strong>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex justify-center gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setImplicadoEliminar(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={confirmarEliminarImplicado}
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
        <div
          className={`rounded-md border px-4 py-3 text-sm ${mensajeError
            ? 'border-danger/30 bg-danger/5 text-danger'
            : 'border-success/30 bg-success/5 text-success'
            }`}
        >
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
          loading={empresasLoading || empresasFetching}
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
                <DetalleCampo
                  label="Nombre / Razón Social"
                  value={personaDetalle.nombre}
                  full
                />
                <DetalleCampo label="NIT" value={personaDetalle.nit} />
                <DetalleCampo
                  label="Matrícula"
                  value={personaDetalle.matricula}
                />
                <DetalleCampo
                  label="Representante Legal"
                  value={personaDetalle.representante}
                />
                <DetalleCampo
                  label="Capital Social"
                  value={personaDetalle.capitalSocial}
                />
                <DetalleCampo
                  label="Dirección"
                  value={personaDetalle.direccion}
                  full
                />
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
                  value={personaDetalle.vinculo?.descripcion}
                />
                <DetalleCampo
                  label="Pericia"
                  value={personaDetalle.pericia ? 'Sí' : 'No'}
                />
                {personaDetalle.pericia && (
                  <DetalleCampo
                    label="Resultado Pericia"
                    value={personaDetalle.resultado}
                    full
                  />
                )}
                <DetalleCampo
                  label="Beneficiarios finales"
                  value={
                    personaDetalle.implicados?.length
                      ? `${personaDetalle.implicados.length} registrado(s)`
                      : null
                  }
                />
                <DetalleCampo
                  label="Situación Jurídica"
                  value={
                    personaDetalle.ultimaSituacionJuridica?.descripcionTipo
                  }
                />
                <DetalleCampo
                  label="Fecha Situación"
                  value={formatFecha(
                    personaDetalle.ultimaSituacionJuridica?.fecha,
                    'dd/MM/yyyy'
                  )}
                />
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
                <strong>{personaEliminar.nombre}</strong>? Esta acción no se
                puede deshacer.
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
