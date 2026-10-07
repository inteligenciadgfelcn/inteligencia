'use client'

import { useEffect, useState } from 'react'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import IconEye from '@/components/Icon/IconEye'
import IconPlus from '@/components/Icon/IconPlus'
import IconTrash from '@/components/Icon/IconTrash'

import { BienesApi } from '../api/bienes-apd.api'
import type {
  PersonaVinculo,
  TipoDocumento,
  TipoVinculo,
  Vinculo,
  VinculoBienRow,
  VinculoBorradorRow,
} from '../types/bienes-apd.types'
import type { PersonaImplicadaRow } from '../../registro_caso/types/registro-caso-apd.types'

const LIMITE_PERSONAS = 30

type PersonaDetalle = PersonaImplicadaRow | PersonaVinculo

interface FilaVinculo {
  clave: string
  idDetenidoAuxiliar: number
  idVinculo: number
  idTipoVinculo: number
  nombre: string
  ci: string
  vinculoDescripcion?: string
  tipoVinculoDescripcion?: string
  persona: PersonaDetalle | null
}

interface Props {
  casoId: number
  itemBienSecuestrado: string | null
  vinculos: VinculoBienRow[]
  borradores: VinculoBorradorRow[]
  loading?: boolean
  onAgregarBorrador: (borrador: VinculoBorradorRow) => void
  onQuitarBorrador: (idDetenidoAuxiliar: number) => void
}

const nombreCompleto = (
  persona: {
    nombres?: string | null
    paterno?: string | null
    materno?: string | null
    esposo?: string | null
  } | null
) =>
  [persona?.nombres, persona?.paterno, persona?.materno, persona?.esposo]
    .filter(Boolean)
    .join(' ')
    .trim() || '-'

export function VinculosBienCard({
  casoId,
  itemBienSecuestrado,
  vinculos,
  borradores,
  loading,
  onAgregarBorrador,
  onQuitarBorrador,
}: Props) {
  const queryClient = useQueryClient()

  const [modalPersonas, setModalPersonas] = useState(false)
  const [filtro, setFiltro] = useState('')
  const [filtroDebounced, setFiltroDebounced] = useState('')
  const [pagina, setPagina] = useState(1)
  const [limite, setLimite] = useState(LIMITE_PERSONAS)
  const [personaSel, setPersonaSel] = useState<PersonaImplicadaRow | null>(null)
  const [idVinculoSel, setIdVinculoSel] = useState(0)
  const [idTipoVinculoSel, setIdTipoVinculoSel] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personaDetalle, setPersonaDetalle] = useState<PersonaDetalle | null>(
    null
  )

  const { data: catalogoVinculos = [] } = useQuery<Vinculo[]>({
    queryKey: ['lgi-bienes', 'vinculos'],
    queryFn: () => BienesApi.listarVinculos(),
  })

  const { data: catalogoTiposDocumento = [] } = useQuery<TipoDocumento[]>({
    queryKey: ['lgi-bienes', 'tipos-documento'],
    queryFn: () => BienesApi.listarTiposDocumento(),
  })

  const { data: tiposVinculoSel = [] } = useQuery<TipoVinculo[]>({
    queryKey: ['lgi-bienes', 'tipos-vinculo', idVinculoSel],
    enabled: modalPersonas && idVinculoSel > 0,
    queryFn: () => BienesApi.listarTiposVinculo(idVinculoSel),
  })

  useEffect(() => {
    const timer = setTimeout(() => setFiltroDebounced(filtro), 300)
    return () => clearTimeout(timer)
  }, [filtro])

  useEffect(() => {
    setPagina(1)
  }, [filtroDebounced])

  const { data: personas, isLoading: cargandoPersonas } = useQuery({
    queryKey: [
      'lgi-bienes',
      'personas-implicadas',
      casoId,
      pagina,
      limite,
      filtroDebounced,
    ],
    enabled: modalPersonas,
    queryFn: () =>
      BienesApi.listarPersonasImplicadas(casoId, {
        pagina,
        limite,
        ...(filtroDebounced ? { filtro: filtroDebounced } : {}),
      }),
  })

  const filasServidor: FilaVinculo[] = vinculos.map((v) => ({
    clave: `v-${v.idVinculoBien}`,
    idDetenidoAuxiliar: v.idDetenidoAuxiliar ?? 0,
    idVinculo: v.idVinculo ?? 0,
    idTipoVinculo: v.idTipoVinculo ?? 0,
    nombre: nombreCompleto(v.detenidoAuxiliar),
    ci: v.detenidoAuxiliar?.numeroDocumento ?? '',
    persona: v.detenidoAuxiliar,
  }))

  const filasBorrador: FilaVinculo[] = borradores.map((b) => ({
    clave: `b-${b.idDetenidoAuxiliar}`,
    idDetenidoAuxiliar: b.idDetenidoAuxiliar,
    idVinculo: b.idVinculo,
    idTipoVinculo: b.idTipoVinculo,
    vinculoDescripcion: b.vinculoDescripcion,
    tipoVinculoDescripcion: b.tipoVinculoDescripcion,
    nombre: nombreCompleto(b.persona),
    ci: b.persona.numeroDocumento ?? '',
    persona: b.persona,
  }))

  const filas = itemBienSecuestrado ? filasServidor : filasBorrador

  const idsVinculos = [
    ...new Set(filas.map((fila) => fila.idVinculo).filter((id) => id > 0)),
  ]

  const consultasTipos = useQueries({
    queries: idsVinculos.map((idVinculo) => ({
      queryKey: ['lgi-bienes', 'tipos-vinculo', idVinculo],
      queryFn: () => BienesApi.listarTiposVinculo(idVinculo),
    })),
  })

  const mapaTipos: Record<number, TipoVinculo[]> = {}
  consultasTipos.forEach((consulta, indice) => {
    mapaTipos[idsVinculos[indice]] = consulta.data ?? []
  })

  const columnas: Column<FilaVinculo>[] = [
    { accessor: 'nombre', title: 'Persona' },
    { accessor: 'ci', title: 'CI' },
    {
      accessor: 'idVinculo',
      title: 'Vínculo',
      render: (fila) =>
        fila.vinculoDescripcion ??
        catalogoVinculos.find((v) => v.idVinculo === fila.idVinculo)
          ?.descripcion ??
        String(fila.idVinculo || '-'),
    },
    {
      accessor: 'idTipoVinculo',
      title: 'Tipo de vínculo',
      render: (fila) =>
        fila.tipoVinculoDescripcion ??
        mapaTipos[fila.idVinculo]?.find(
          (t) => t.idTipoVinculo === fila.idTipoVinculo
        )?.descripcion ??
        String(fila.idTipoVinculo || '-'),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (fila) => (
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            title="Ver detalle de la persona"
            onClick={() => setPersonaDetalle(fila.persona)}
          >
            <IconEye />
          </Button>
          {!itemBienSecuestrado && (
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              title="Quitar del listado"
              onClick={() => onQuitarBorrador(fila.idDetenidoAuxiliar)}
            >
              <IconTrash />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const columnasPersonas: Column<PersonaImplicadaRow>[] = [
    {
      accessor: 'nombres',
      title: 'Persona',
      render: (fila) => nombreCompleto(fila),
    },
    { accessor: 'numeroDocumento', title: 'CI' },
    {
      accessor: 'ultimaSituacionJuridica',
      title: 'Situación jurídica',
      render: (fila) =>
        fila.ultimaSituacionJuridica?.situacionLegal?.descripcion ?? '-',
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (fila) => (
        <Button
          type="button"
          variant={
            personaSel?.deId === fila.deId ? 'primary' : 'outline-primary'
          }
          size="sm"
          onClick={() => {
            setPersonaSel(fila)
            setIdVinculoSel(0)
            setIdTipoVinculoSel(0)
            setError(null)
          }}
        >
          Seleccionar
        </Button>
      ),
    },
  ]

  const abrirModal = () => {
    setFiltro('')
    setFiltroDebounced('')
    setPagina(1)
    setPersonaSel(null)
    setIdVinculoSel(0)
    setIdTipoVinculoSel(0)
    setError(null)
    setModalPersonas(true)
  }

  const cerrarModal = () => {
    setModalPersonas(false)
    setGuardando(false)
  }

  const vincular = async () => {
    if (!personaSel || !idVinculoSel || !idTipoVinculoSel || guardando) return

    if (filas.some((fila) => fila.idDetenidoAuxiliar === personaSel.deId)) {
      setError('La persona ya se encuentra vinculada a este bien.')
      return
    }

    const vinculoDescripcion =
      catalogoVinculos.find((v) => v.idVinculo === idVinculoSel)?.descripcion ??
      ''
    const tipoVinculoDescripcion =
      tiposVinculoSel.find((t) => t.idTipoVinculo === idTipoVinculoSel)
        ?.descripcion ?? ''

    if (!itemBienSecuestrado) {
      onAgregarBorrador({
        idDetenidoAuxiliar: personaSel.deId,
        idVinculo: idVinculoSel,
        idTipoVinculo: idTipoVinculoSel,
        vinculoDescripcion,
        tipoVinculoDescripcion,
        persona: personaSel,
      })
      cerrarModal()
      return
    }

    setGuardando(true)
    setError(null)
    try {
      await BienesApi.crearVinculoBien({
        idDetenidoAuxiliar: Number(personaSel.deId),
        idVinculo: Number(idVinculoSel),
        idTipoVinculo: Number(idTipoVinculoSel),
        idItemBienSecuestrado: itemBienSecuestrado,
      })
      await queryClient.invalidateQueries({
        queryKey: ['lgi-bienes', 'vinculos', itemBienSecuestrado],
      })
      cerrarModal()
    } catch {
      setError('No se pudo registrar el vínculo. Intente nuevamente.')
      setGuardando(false)
    }
  }

  const normalizarPersona = (persona: PersonaDetalle) => {
    const datos = persona as unknown as PersonaImplicadaRow & PersonaVinculo
    return {
      nombre: nombreCompleto(datos),
      tipoDocumento:
        datos.tipoDocumento?.descripcion ??
        catalogoTiposDocumento.find(
          (d) => Number(d.td_id) === Number(datos.tipoDocumentoId)
        )?.descripcion ??
        null,
      numeroDocumento: datos.numeroDocumento ?? null,
      sexo:
        datos.sexo === 'M'
          ? 'Masculino'
          : datos.sexo === 'F'
            ? 'Femenino'
            : null,
      estado:
        typeof datos.estado === 'boolean'
          ? datos.estado
            ? 'Activo'
            : 'Inactivo'
          : null,
      relacion: datos.relacion ?? null,
      observaciones: datos.observaciones ?? null,
      situacionJuridica:
        datos.ultimaSituacionJuridica?.situacionLegal?.descripcion ?? null,
    }
  }

  const infoPersona = personaDetalle ? normalizarPersona(personaDetalle) : null

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          className="gap-2 shrink-0"
          onClick={abrirModal}
        >
          <IconPlus /> Agregar persona
        </Button>
      </div>

      <VristoSimpleDataTable<FilaVinculo>
        rows={filas}
        columns={columnas}
        loading={loading}
      />

      {modalPersonas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Vincular persona
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={cerrarModal}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 p-5">
              <Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar por nombre o número de documento"
              />

              <VristoDataTable<PersonaImplicadaRow>
                rows={personas?.filas ?? []}
                total={personas?.total ?? 0}
                page={pagina}
                limit={limite}
                onPageChange={setPagina}
                onLimitChange={setLimite}
                columns={columnasPersonas}
                loading={cargandoPersonas}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Vínculo *
                  </label>
                  <Select
                    options={catalogoVinculos.map((v) => ({
                      value: v.idVinculo,
                      label: v.descripcion,
                    }))}
                    placeholder="Seleccione vínculo"
                    value={idVinculoSel ? String(idVinculoSel) : ''}
                    disabled={!personaSel}
                    onChange={(e) => {
                      setIdVinculoSel(Number(e.target.value) || 0)
                      setIdTipoVinculoSel(0)
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Tipo de vínculo *
                  </label>
                  <Select
                    options={tiposVinculoSel.map((t) => ({
                      value: t.idTipoVinculo,
                      label: t.descripcion,
                    }))}
                    placeholder="Seleccione tipo"
                    value={idTipoVinculoSel ? String(idTipoVinculoSel) : ''}
                    disabled={!personaSel || !idVinculoSel}
                    onChange={(e) =>
                      setIdTipoVinculoSel(Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={cerrarModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  loading={guardando}
                  disabled={
                    guardando ||
                    !personaSel ||
                    !idVinculoSel ||
                    !idTipoVinculoSel
                  }
                  onClick={vincular}
                >
                  Vincular
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {personaDetalle && infoPersona && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Detalle de la persona
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
                  label="Nombre completo"
                  value={infoPersona.nombre}
                  full
                />
                <DetalleCampo
                  label="Tipo de documento"
                  value={infoPersona.tipoDocumento}
                />
                <DetalleCampo
                  label="N° de documento"
                  value={infoPersona.numeroDocumento}
                />
                <DetalleCampo label="Sexo" value={infoPersona.sexo} />
                <DetalleCampo label="Estado" value={infoPersona.estado} />
                <DetalleCampo
                  label="Relación"
                  value={infoPersona.relacion}
                  full
                />
                <DetalleCampo
                  label="Observaciones"
                  value={infoPersona.observaciones}
                  full
                />
                <DetalleCampo
                  label="Situación jurídica"
                  value={infoPersona.situacionJuridica}
                  full
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
