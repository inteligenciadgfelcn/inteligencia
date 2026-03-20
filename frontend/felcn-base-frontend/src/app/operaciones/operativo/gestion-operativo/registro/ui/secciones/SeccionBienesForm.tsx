'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DataTable } from 'mantine-datatable'
import IconTrash from '@/components/Icon/IconTrash'
import {
    BienCaracteristicaResponse,
    BienResponse,
    CatalogoClaseBien,
    CatalogoTipoBien,
    GestionOperativoBienesService,
    GestionOperativoCatalogosService,
} from '@/services/operativos'
import { LookupBasico, SiiiLookupsService } from '@/services/parametricas'

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FotosBienCache = { foto: string | null }

// ─── DropzoneFoto ─────────────────────────────────────────────────────────────
function DropzoneFoto({
    label,
    archivo,
    onChange,
}: {
    label: string
    archivo: File | null
    onChange: (file: File | null) => void
}) {
    const [arrastrar, setArrastrar] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setArrastrar(false)
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) onChange(file)
    }

    return (
        <div>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${arrastrar
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-[#e0e6ed] hover:border-green-400 dark:border-[#1b2e4b] dark:hover:border-green-600'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setArrastrar(true) }}
                onDragEnter={() => setArrastrar(true)}
                onDragLeave={() => setArrastrar(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                {archivo ? (
                    <div
                        className="flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                            {archivo.name}
                        </span>
                        <button
                            type="button"
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={() => {
                                if (inputRef.current) inputRef.current.value = ''
                                onChange(null)
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <svg
                            className="mx-auto mb-2 h-7 w-7 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                        <p className="text-xs">
                            <span className="font-medium text-green-600">Sube un archivo</span>
                            <span className="text-gray-500"> o arrastra y suelta</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</p>
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
        </div>
    )
}

// ─── FotoSlot ─────────────────────────────────────────────────────────────────
function FotoSlot({
    src,
    label,
    onZoom,
}: {
    src: string | null
    label: string
    onZoom: (src: string) => void
}) {
    return (
        <div>
            <p className="mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                {label}
            </p>
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={label}
                    className="h-40 w-full cursor-zoom-in rounded object-cover shadow-sm hover:opacity-90"
                    onClick={() => onZoom(src)}
                />
            ) : (
                <div className="flex h-40 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs text-gray-400">Sin foto</span>
                </div>
            )}
        </div>
    )
}

// ─── CaracteristicasPanel ─────────────────────────────────────────────────────
function CaracteristicasPanel({
    idoperativo,
    bien,
}: {
    idoperativo: number
    bien: BienResponse
}) {
    // ── Lista de características ──────────────────────────────────────────────
    const [caracteristicas, setCaracteristicas] = useState<BienCaracteristicaResponse[]>([])
    const [cargandoLista, setCargandoLista] = useState(false)

    const cargarLista = useCallback(async () => {
        if (!idoperativo || !bien.id) return
        setCargandoLista(true)
        try {
            const res = await GestionOperativoBienesService.listarCaracteristicas(
                idoperativo,
                Number(bien.id),
            )
            if (res?.finalizado) {
                setCaracteristicas(
                    (res.datos as any)?.filas ?? (res.datos as any) ?? [],
                )
            }
        } finally {
            setCargandoLista(false)
        }
    }, [idoperativo, bien.id])

    useEffect(() => {
        void cargarLista()
    }, [cargarLista])

    const eliminarCaracteristica = async (id: number) => {
        if (!window.confirm('¿Eliminar esta característica?')) return
        await GestionOperativoBienesService.eliminarCaracteristica(
            idoperativo,
            Number(bien.id),
            id,
        )
        void cargarLista()
    }

    // ── Formulario para agregar ───────────────────────────────────────────────
    const [opcionesCaracteristica, setOpcionesCaracteristica] = useState<
        { id: string; label: string }[]
    >([])
    const [idCatalogoCaracteristica, setIdCatalogoCaracteristica] = useState('')
    const [descripcionCaracteristica, setDescripcionCaracteristica] = useState('')
    const [cargandoForm, setCargandoForm] = useState(false)

    useEffect(() => {
        if (!bien.idCatalogoClase) return
        let activo = true
        const cargar = async () => {
            try {
                const res = await GestionOperativoCatalogosService.obtenerCaracteristicasBien(
                    Number(bien.idCatalogoClase),
                )
                if (!activo) return
                if (res?.finalizado) {
                    setOpcionesCaracteristica(
                        (res.datos ?? []).map((c: any) => ({
                            id: String(c.id),
                            label: c.descripcion,
                        })),
                    )
                }
            } catch {
                if (activo) setOpcionesCaracteristica([])
            }
        }
        void cargar()
        return () => { activo = false }
    }, [bien.idCatalogoClase])

    const guardar = async () => {
        if (!idoperativo || !idCatalogoCaracteristica) return
        setCargandoForm(true)
        try {
            const res = await GestionOperativoBienesService.crearCaracteristica(
                idoperativo,
                Number(bien.id),
                {
                    idCatalogoCaracteristica: Number(idCatalogoCaracteristica),
                    descripcion: descripcionCaracteristica,
                },
            )
            if (res?.finalizado) {
                setIdCatalogoCaracteristica('')
                setDescripcionCaracteristica('')
                void cargarLista()
            }
        } finally {
            setCargandoForm(false)
        }
    }

    return (
        <div className="space-y-3">
            {/* ── Lista sin header ── */}
            {cargandoLista ? (
                <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-7 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                        />
                    ))}
                </div>
            ) : caracteristicas.length === 0 ? (
                <div className="flex items-center justify-center rounded border border-dashed border-[#e0e6ed] py-6 dark:border-gray-700">
                    <span className="text-xs text-gray-400">Sin características registradas</span>
                </div>
            ) : (
                <ul className="divide-y divide-[#e0e6ed] dark:divide-gray-700">
                    {caracteristicas.map((c) => (
                        <li
                            key={c.id}
                            className="flex items-start justify-between gap-2 py-2"
                        >
                            <span className="text-sm">
                                <span className="font-medium text-gray-500 dark:text-gray-400">
                                    {c.descripcionCaracteristica}:&nbsp;
                                </span>
                                {c.descripcion}
                            </span>
                            <button
                                type="button"
                                className="mt-0.5 shrink-0 text-danger hover:text-danger/80"
                                onClick={() => void eliminarCaracteristica(c.id)}
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Formulario para agregar ── */}
            <div className="border-t border-[#e0e6ed] pt-3 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Característica</label>
                        <select
                            className="form-select w-full"
                            value={idCatalogoCaracteristica}
                            onChange={(e) => setIdCatalogoCaracteristica(e.target.value)}
                            disabled={cargandoForm || opcionesCaracteristica.length === 0}
                        >
                            <option value="">Seleccione</option>
                            {opcionesCaracteristica.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Descripción</label>
                        <input
                            type="text"
                            className="form-input w-full"
                            value={descripcionCaracteristica}
                            onChange={(e) => setDescripcionCaracteristica(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => void guardar()}
                        disabled={cargandoForm || !idCatalogoCaracteristica}
                    >
                        Guardar Característica
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── ExpansionContenidoBien ───────────────────────────────────────────────────
function ExpansionContenidoBien({
    bien,
    idoperativo,
    cache,
    onCacheLoad,
    onZoom,
}: {
    bien: BienResponse
    idoperativo: number
    cache: FotosBienCache | undefined
    onCacheLoad: (id: string, fotos: FotosBienCache) => void
    onZoom: (src: string) => void
}) {
    useEffect(() => {
        if (cache) return
        const fetchFoto = (path: string | null | undefined): Promise<string | null> =>
            path
                ? GestionOperativoBienesService.obtenerFoto(path)
                    .then((blob) => URL.createObjectURL(blob))
                    .catch(() => null)
                : Promise.resolve(null)

        void fetchFoto(bien.urlFotoBien).then((foto) => {
            onCacheLoad(bien.id, { foto })
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Columna izquierda: foto */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                        Fotografía del Bien
                    </p>
                    {!cache ? (
                        <div className="h-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    ) : (
                        <FotoSlot src={cache.foto} label="Foto del Bien" onZoom={onZoom} />
                    )}
                </div>

                {/* Columna derecha: características */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                        Características
                    </p>
                    <CaracteristicasPanel idoperativo={idoperativo} bien={bien} />
                </div>
            </div>
        </div>
    )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface SeccionFormProps {
    titulo: string
    idoperativo?: number
}

const ITEMS_POR_PAGINA = 10

// ─── SeccionBienesForm ────────────────────────────────────────────────────────
export function SeccionBienesForm({ titulo, idoperativo = 0 }: SeccionFormProps) {
    // ── Catálogos ─────────────────────────────────────────────────────────────
    const [bienes, setBienes] = useState<LookupBasico[]>([])
    const [clases, setClases] = useState<CatalogoClaseBien[]>([])
    const [tipos, setTipos] = useState<CatalogoTipoBien[]>([])

    useEffect(() => {
        SiiiLookupsService.obtenerBienes().then((res) => {
            if (res?.finalizado) setBienes(res.datos ?? [])
        })
    }, [])

    // ── Campos del formulario ─────────────────────────────────────────────────
    const [idBien, setIdBien] = useState('')
    const [idCatalogoClase, setIdCatalogoClase] = useState('')
    const [idCatalogoTipo, setIdCatalogoTipo] = useState('')
    const [cantidadBien, setCantidadBien] = useState('')
    const [costoAproximado, setCostoAproximado] = useState('')
    const [costoCuantificado, setCostoCuantificado] = useState('')
    const [enInvestigacion, setEnInvestigacion] = useState('')
    const [dropzoneToken, setDropzoneToken] = useState(0)
    const [foto, setFoto] = useState<File | null>(null)

    // ── Lista, paginación y estado general ────────────────────────────────────
    const [cargando, setCargando] = useState(false)
    const [items, setItems] = useState<BienResponse[]>([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [pagina, setPagina] = useState(1)
    const [expandedIds, setExpandedIds] = useState<string[]>([])

    // ── Cache de fotos ────────────────────────────────────────────────────────
    const [fotosCache, setFotosCache] = useState<Record<string, FotosBienCache>>({})
    const fotosCacheRef = useRef<Record<string, FotosBienCache>>({})
    const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

    const actualizarCache = useCallback((id: string, fotos: FotosBienCache) => {
        fotosCacheRef.current[id] = fotos
        setFotosCache((prev) => ({ ...prev, [id]: fotos }))
    }, [])

    const limpiarCache = useCallback(() => {
        Object.values(fotosCacheRef.current).forEach(({ foto }) => {
            if (foto) URL.revokeObjectURL(foto)
        })
        fotosCacheRef.current = {}
        setFotosCache({})
    }, [])

    useEffect(() => () => { limpiarCache() }, [limpiarCache])

    // ── Cascading: bien → clase → tipo ────────────────────────────────────────
    const handleChangeBien = async (valor: string) => {
        setIdBien(valor)
        setIdCatalogoClase('')
        setIdCatalogoTipo('')
        setClases([])
        setTipos([])
        if (!valor) return
        const res = await GestionOperativoCatalogosService.obtenerClasesBien(Number(valor))
        if (res?.finalizado) setClases(res.datos ?? [])
    }

    const handleChangeClase = async (valor: string) => {
        setIdCatalogoClase(valor)
        setIdCatalogoTipo('')
        setTipos([])
        if (!valor) return
        const res = await GestionOperativoCatalogosService.obtenerTiposBien(Number(valor))
        if (res?.finalizado) setTipos(res.datos ?? [])
    }

    // ── Cargar bienes ─────────────────────────────────────────────────────────
    const cargarBienes = useCallback(
        async (pag: number = 1) => {
            if (!idoperativo) return
            setCargando(true)
            limpiarCache()
            setExpandedIds([])
            try {
                const res = await GestionOperativoBienesService.listar(
                    idoperativo,
                    pag,
                    ITEMS_POR_PAGINA,
                )
                if (res?.finalizado) {
                    setItems(res.datos?.filas ?? [])
                    setTotalRegistros(res.datos?.page?.totalElements ?? 0)
                }
            } finally {
                setCargando(false)
            }
        },
        [idoperativo, limpiarCache],
    )

    useEffect(() => {
        void cargarBienes(1)
    }, [idoperativo]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Reset formulario ──────────────────────────────────────────────────────
    const resetForm = useCallback(() => {
        setIdBien('')
        setIdCatalogoClase('')
        setIdCatalogoTipo('')
        setCantidadBien('')
        setCostoAproximado('')
        setCostoCuantificado('')
        setEnInvestigacion('')
        setFoto(null)
        setClases([])
        setTipos([])
        setDropzoneToken((t) => t + 1)
    }, [])

    // ── Guardar bien ──────────────────────────────────────────────────────────
    const guardarBien = async () => {
        if (!idoperativo) return
        setCargando(true)
        try {
            const res = await GestionOperativoBienesService.crear(idoperativo, {
                idCatalogoTipo: Number(idCatalogoTipo),
                cantidadBien: Number(cantidadBien),
                costoAproximado: Number(costoAproximado),
                costoCuantificado: Number(costoCuantificado),
                enInvestigacion: enInvestigacion === 'true',
                foto: foto ?? undefined,
            })
            if (res?.finalizado) {
                await cargarBienes(1)
                setPagina(1)
                resetForm()
            }
        } finally {
            setCargando(false)
        }
    }

    // ── Eliminar bien ─────────────────────────────────────────────────────────
    const handleEliminar = async (id: string) => {
        if (!window.confirm('¿Está seguro de eliminar este bien?')) return
        setCargando(true)
        try {
            await GestionOperativoBienesService.eliminar(idoperativo, Number(id))
            setExpandedIds((prev) => prev.filter((eid) => eid !== id))
            await cargarBienes(pagina)
        } finally {
            setCargando(false)
        }
    }

    const handleCambioPagina = (nuevaPagina: number) => {
        setPagina(nuevaPagina)
        void cargarBienes(nuevaPagina)
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div>
            <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
                <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

                {/* ── Formulario de registro ── */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Bien</label>
                        <select
                            className="form-select w-full"
                            value={idBien}
                            onChange={(e) => void handleChangeBien(e.target.value)}
                        >
                            <option value="">Seleccione un dato</option>
                            {bienes.map((b) => (
                                <option key={b.id} value={String(b.id)}>
                                    {b.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Clase</label>
                        <select
                            className="form-select w-full"
                            value={idCatalogoClase}
                            disabled={clases.length === 0}
                            onChange={(e) => void handleChangeClase(e.target.value)}
                        >
                            <option value="">Seleccione un dato</option>
                            {clases.map((c) => (
                                <option key={c.id} value={String(c.id)}>
                                    {c.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Tipo</label>
                        <select
                            className="form-select w-full"
                            value={idCatalogoTipo}
                            disabled={tipos.length === 0}
                            onChange={(e) => setIdCatalogoTipo(e.target.value)}
                        >
                            <option value="">Seleccione un dato</option>
                            {tipos.map((t) => (
                                <option key={t.id} value={String(t.id)}>
                                    {t.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Cantidad</label>
                        <input
                            type="text"
                            className="form-input w-full"
                            value={cantidadBien}
                            onChange={(e) => setCantidadBien(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Costo Aproximado (Bs.)
                        </label>
                        <input
                            type="text"
                            className="form-input w-full"
                            value={costoAproximado}
                            onChange={(e) => {
                                const val = e.target.value
                                if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                                    setCostoAproximado(val)
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Costo Cuantificado (Bs.)
                        </label>
                        <input
                            type="text"
                            className="form-input w-full"
                            value={costoCuantificado}
                            onChange={(e) => {
                                const val = e.target.value
                                if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                                    setCostoCuantificado(val)
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            ¿En Investigación?
                        </label>
                        <select
                            className="form-select w-full"
                            value={enInvestigacion}
                            onChange={(e) => setEnInvestigacion(e.target.value)}
                        >
                            <option value="">Seleccione un dato</option>
                            <option value="true">SI</option>
                            <option value="false">NO</option>
                        </select>
                    </div>

                    {/* Foto — DropzoneFoto */}
                    <div className="col-span-1 lg:col-span-4">
                        <DropzoneFoto
                            key={`foto-bien-${dropzoneToken}`}
                            label="Fotografía del Bien"
                            archivo={foto}
                            onChange={setFoto}
                        />
                    </div>

                    {/* Botón guardar */}
                    <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => void guardarBien()}
                            disabled={cargando}
                        >
                            Guardar
                        </button>
                    </div>
                </div>

                {/* ── Tabla de bienes registrados ── */}
                <div className="mt-5">
                    <div className="datatables">
                        <DataTable
                            fetching={cargando}
                            withTableBorder={false}
                            className="table-hover whitespace-nowrap"
                            records={items}
                            totalRecords={totalRegistros}
                            recordsPerPage={ITEMS_POR_PAGINA}
                            page={pagina}
                            onPageChange={handleCambioPagina}
                            noRecordsText="Sin bienes registrados"
                            highlightOnHover
                            columns={[
                                { accessor: 'descripcionBien', title: 'Bien' },
                                { accessor: 'descripcionCatalogoClase', title: 'Clase' },
                                { accessor: 'descripcionCatalogoTipo', title: 'Tipo' },
                                { accessor: 'cantidadBien', title: 'Cantidad' },
                                {
                                    accessor: 'costoAproximado',
                                    title: 'Costo Aprox. (Bs.)',
                                    render: (r) =>
                                        r.costoAproximado != null
                                            ? `Bs. ${r.costoAproximado}`
                                            : '—',
                                },
                                {
                                    accessor: 'costoCuantificado',
                                    title: 'Costo Cuant. (Bs.)',
                                    render: (r) =>
                                        r.costoCuantificado != null
                                            ? `Bs. ${r.costoCuantificado}`
                                            : '—',
                                },
                                {
                                    accessor: 'acciones',
                                    title: 'Acciones',
                                    textAlign: 'center',
                                    width: 80,
                                    render: (r) => (
                                        <div className="flex items-center justify-center gap-3">
                                            <span title="Ver detalles">
                                                <svg
                                                    className={`h-4 w-4 transition-transform duration-200 ${expandedIds.includes(r.id)
                                                            ? 'rotate-180 text-primary'
                                                            : 'text-gray-400'
                                                        }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </span>
                                            <button
                                                type="button"
                                                className="text-danger hover:text-danger/80"
                                                title="Eliminar"
                                                disabled={cargando}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    void handleEliminar(r.id)
                                                }}
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            rowExpansion={{
                                allowMultiple: false,
                                expanded: {
                                    recordIds: expandedIds,
                                    onRecordIdsChange: setExpandedIds as (ids: unknown[]) => void,
                                },
                                content: ({ record }) => (
                                    <ExpansionContenidoBien
                                        bien={record}
                                        idoperativo={idoperativo}
                                        cache={fotosCache[record.id]}
                                        onCacheLoad={actualizarCache}
                                        onZoom={setImagenAmpliada}
                                    />
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Lightbox ── */}
            {imagenAmpliada && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
                    onClick={() => setImagenAmpliada(null)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imagenAmpliada}
                            alt="Vista ampliada"
                            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        />
                        <button
                            type="button"
                            className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
                            onClick={() => setImagenAmpliada(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
