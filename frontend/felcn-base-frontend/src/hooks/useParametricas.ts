import { useCallback, useState } from 'react'
import {
    AsigLookupsService,
    Continente,
    Departamento,
    Distrital,
    EstructuraService,
    Grupo,
    Localidad,
    Provincia,
    SiiiLookupsService,
    UnidadAsig,
    UnidadEstructura,
} from '@/services/parametricas'

/**
 * Hook central para consultar los datos paramétricos (lookups).
 *
 * Uso básico:
 * ```tsx
 * const { departamentos, cargarDepartamentos, cargando } = useParametricas()
 *
 * useEffect(() => { cargarDepartamentos() }, [])
 * ```
 */
export function useParametricas() {
    const [cargando, setCargando] = useState(false)

    // ── siii-lookups ──────────────────────────────────────────────────────────
    const [continentes, setContinentes] = useState<Continente[]>([])
    const [departamentos, setDepartamentos] = useState<Departamento[]>([])
    const [provincias, setProvincias] = useState<Provincia[]>([])
    const [localidades, setLocalidades] = useState<Localidad[]>([])

    // ── asig-lookups ──────────────────────────────────────────────────────────
    const [unidadesAsig, setUnidadesAsig] = useState<UnidadAsig[]>([])

    // ── estructura ────────────────────────────────────────────────────────────
    const [unidadesEstructura, setUnidadesEstructura] = useState<
        UnidadEstructura[]
    >([])
    const [distritales, setDistritales] = useState<Distrital[]>([])
    const [grupos, setGrupos] = useState<Grupo[]>([])

    // ── métodos ───────────────────────────────────────────────────────────────

    const cargarContinentes = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerContinentes()
            if (res.finalizado) setContinentes(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarDepartamentos = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerDepartamentos()
            if (res.finalizado) setDepartamentos(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarProvincias = useCallback(async (idDepartamento: number) => {
        setCargando(true)
        setProvincias([])
        setLocalidades([])
        try {
            const res = await SiiiLookupsService.obtenerProvincias(idDepartamento)
            if (res.finalizado) setProvincias(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarLocalidades = useCallback(async (idProvincia: number) => {
        setCargando(true)
        setLocalidades([])
        try {
            const res = await SiiiLookupsService.obtenerLocalidades(idProvincia)
            if (res.finalizado) setLocalidades(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarUnidadesAsig = useCallback(async () => {
        setCargando(true)
        try {
            const res = await AsigLookupsService.obtenerUnidades()
            if (res.finalizado) setUnidadesAsig(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarUnidadesEstructura = useCallback(async () => {
        setCargando(true)
        try {
            const res = await EstructuraService.obtenerUnidades()
            if (res.finalizado) setUnidadesEstructura(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarDistritales = useCallback(async (idUnidad: number) => {
        setCargando(true)
        setDistritales([])
        setGrupos([])
        try {
            const res = await EstructuraService.obtenerDistritales(idUnidad)
            if (res.finalizado) setDistritales(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarGrupos = useCallback(async (idDistrital: number) => {
        setCargando(true)
        setGrupos([])
        try {
            const res = await EstructuraService.obtenerGrupos(idDistrital)
            if (res.finalizado) setGrupos(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    return {
        cargando,
        // siii-lookups
        continentes,
        departamentos,
        provincias,
        localidades,
        cargarContinentes,
        cargarDepartamentos,
        cargarProvincias,
        cargarLocalidades,
        // asig-lookups
        unidadesAsig,
        cargarUnidadesAsig,
        // estructura
        unidadesEstructura,
        distritales,
        grupos,
        cargarUnidadesEstructura,
        cargarDistritales,
        cargarGrupos,
    }
}
