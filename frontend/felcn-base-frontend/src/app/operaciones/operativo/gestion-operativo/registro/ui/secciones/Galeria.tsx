'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DataTable } from 'mantine-datatable'
import IconTrash from '@/components/Icon/IconTrash'
import { GestionOperativoGaleriaService } from '@/services/operativos'
import type { GaleriaResponse } from '@/services/operativos'

// ── DropzoneFoto ─────────────────────────────────────────────────────────────
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

// ── ImagenAutenticada ────────────────────────────────────────────────────────
function ImagenAutenticada({
    path,
    alt,
    className,
    onClick,
}: {
    path: string
    alt: string
    className?: string
    onClick?: (src: string) => void
}) {
    const [src, setSrc] = useState<string | null>(null)

    useEffect(() => {
        if (!path) return
        let objectUrl: string
        GestionOperativoGaleriaService.obtenerFoto(path)
            .then((blob) => {
                objectUrl = URL.createObjectURL(blob)
                setSrc(objectUrl)
            })
            .catch(() => setSrc(null))
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [path])

    if (!src) return (
        <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
            <span className="text-[10px] text-gray-400">Cargando...</span>
        </div>
    )

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={onClick ? `${className ?? ''} cursor-zoom-in` : className}
            onClick={() => onClick?.(src)}
        />
    )
}

const ITEMS_POR_PAGINA = 10

interface Props {
    titulo: string
    idoperativo: number
}

export function Galeria({ titulo, idoperativo }: Props) {
    const [descripcion, setDescripcion] = useState('')
    const [idTipoTamano, setIdTipoTamano] = useState('')
    const [archivo, setArchivo] = useState<File | null>(null)
    const [dropzoneToken, setDropzoneToken] = useState(0)

    const [cargando, setCargando] = useState(false)
    const [items, setItems] = useState<GaleriaResponse[]>([])
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [pagina, setPagina] = useState(1)
    const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

    const cargar = useCallback(async (pag: number = 1) => {
        if (!idoperativo) return
        setCargando(true)
        try {
            const res = await GestionOperativoGaleriaService.listar(idoperativo, pag, ITEMS_POR_PAGINA)
            if (res?.finalizado) {
                setItems(res.datos?.filas ?? [])
                setTotalRegistros(res.datos?.page?.totalElements ?? 0)
            }
        } finally {
            setCargando(false)
        }
    }, [idoperativo])

    useEffect(() => {
        void cargar(1)
    }, [cargar])

    const resetForm = () => {
        setDescripcion('')
        setIdTipoTamano('')
        setArchivo(null)
        setDropzoneToken((t) => t + 1)
    }

    const handleGuardar = async () => {
        if (!idoperativo || !descripcion || !archivo) {
            alert('Por favor complete todos los campos requeridos.')
            return
        }
        setCargando(true)
        try {
            const res = await GestionOperativoGaleriaService.crear(idoperativo, {
                descripcion,
                idTipoTamano: Number(idTipoTamano),
                foto: archivo || undefined,
            })
            if (res?.finalizado) {
                await cargar(1)
                setPagina(1)
                resetForm()
            }
        } finally {
            setCargando(false)
        }
    }

    const handleEliminar = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar esta fotografía?')) return
        setCargando(true)
        try {
            await GestionOperativoGaleriaService.eliminar(idoperativo, id)
            await cargar(pagina)
        } finally {
            setCargando(false)
        }
    }

    const handleCambioPagina = (nuevaPagina: number) => {
        setPagina(nuevaPagina)
        void cargar(nuevaPagina)
    }

    return (
        <div>
            <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
                <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

                {/* Formulario */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-1 lg:col-span-3">
                        <label htmlFor="descripcion" className="mb-1 block text-sm font-medium">
                            Descripción
                        </label>
                        <input
                            id="descripcion"
                            type="text"
                            placeholder="Ingrese una descripción"
                            className="form-input w-full"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="idTipoTamano" className="mb-1 block text-sm font-medium">
                            Tamaño de Foto
                        </label>
                        <select
                            id="idTipoTamano"
                            className="form-select w-full"
                            value={idTipoTamano}
                            onChange={(e) => setIdTipoTamano(e.target.value)}
                        >
                            <option value="">Seleccione un tamaño</option>
                            <option value="1">Fotografia Horizontal</option>
                            <option value="2">Fotografia Vertical</option>
                            <option value="3">Fotografia Cuadrada</option>
                        </select>
                    </div> */}

                    <div className="col-span-1 lg:col-span-3">
                        <DropzoneFoto
                            key={`galeria-${dropzoneToken}`}
                            label="Fotografía"
                            archivo={archivo}
                            onChange={setArchivo}
                        />
                    </div>

                    <div className="col-span-1 mt-2 lg:col-span-3 flex justify-end">
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => void handleGuardar()}
                            disabled={cargando}
                        >
                            Guardar
                        </button>
                    </div>
                </div>

                {/* Tabla */}
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
                            noRecordsText="Sin fotografías registradas"
                            highlightOnHover
                            columns={[
                                { accessor: 'id', title: 'Cod. Id', width: 100 },
                                { accessor: 'descripcion', title: 'Descripción' },
                                {
                                    accessor: 'fotografia',
                                    title: 'Fotografía',
                                    textAlign: 'center',
                                    render: (r) => (
                                        <div className="flex justify-center">
                                            <ImagenAutenticada
                                                path={r.urlFotoThumbnail}
                                                alt={r.descripcion}
                                                className="h-20 w-32 rounded object-cover shadow-sm"
                                                onClick={() => setImagenAmpliada(r.urlFotoFull)}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'acciones',
                                    title: 'Acciones',
                                    textAlign: 'center',
                                    width: 80,
                                    render: (r) => (
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="button"
                                                className="text-danger hover:text-danger/80"
                                                title="Eliminar"
                                                disabled={cargando}
                                                onClick={() => void handleEliminar(r.id)}
                                            >
                                                <IconTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {imagenAmpliada && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
                    onClick={() => setImagenAmpliada(null)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <ImagenAutenticada
                            path={imagenAmpliada}
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
