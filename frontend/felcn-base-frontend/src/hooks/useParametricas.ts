import { useCallback, useState } from 'react'
import {
    AsigLookupsService,
    Continente,
    Departamento,
    EstructuraService,
    LookupBasico,
    Localidad,
    PlanOperacion,
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
    const [tiposRelevancia, setTiposRelevancia] = useState<LookupBasico[]>([])
    const [tiposDenuncia, setTiposDenuncia] = useState<LookupBasico[]>([])
    const [tiposPenal, setTiposPenal] = useState<LookupBasico[]>([])
    const [tiposOperacion, setTiposOperacion] = useState<LookupBasico[]>([])
    const [planesOperaciones, setPlanesOperaciones] = useState<PlanOperacion[]>([])
    const [unidadesSiii, setUnidadesSiii] = useState<LookupBasico[]>([])

    // ── asig-lookups ──────────────────────────────────────────────────────────
    const [unidadesAsig, setUnidadesAsig] = useState<UnidadAsig[]>([])

    // ── estructura ────────────────────────────────────────────────────────────
    const [unidadesEstructura, setUnidadesEstructura] = useState<
        UnidadEstructura[]
    >([])
    const [distritales, setDistritales] = useState<LookupBasico[]>([])
    const [grupos, setGrupos] = useState<LookupBasico[]>([])

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

    const cargarTiposRelevancia = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerTiposRelevancia()
            if (res.finalizado) setTiposRelevancia(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarTiposDenuncia = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerTiposDenuncia()
            if (res.finalizado) setTiposDenuncia(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarTiposPenal = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerTiposPenal()
            if (res.finalizado) setTiposPenal(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarTiposOperacion = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerTiposOperacion()
            if (res.finalizado) setTiposOperacion(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarPlanesOperaciones = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerPlanesOperaciones()
            if (res.finalizado) setPlanesOperaciones(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarUnidadesSiii = useCallback(async () => {
        setCargando(true)
        try {
            const res = await SiiiLookupsService.obtenerUnidades()
            if (res.finalizado) setUnidadesSiii(res.datos)
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
            const res = await SiiiLookupsService.obtenerDistritalesPorUnidad(idUnidad)
            if (res.finalizado) setDistritales(res.datos)
        } finally {
            setCargando(false)
        }
    }, [])

    const cargarGrupos = useCallback(async (idDistrital: number) => {
        setCargando(true)
        setGrupos([])
        try {
            const res = await SiiiLookupsService.obtenerGruposPorDistrital(idDistrital)
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
        tiposRelevancia,
        tiposDenuncia,
        tiposPenal,
        tiposOperacion,
        planesOperaciones,
        unidadesSiii,
        cargarContinentes,
        cargarDepartamentos,
        cargarProvincias,
        cargarLocalidades,
        cargarTiposRelevancia,
        cargarTiposDenuncia,
        cargarTiposPenal,
        cargarTiposOperacion,
        cargarPlanesOperaciones,
        cargarUnidadesSiii,
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
