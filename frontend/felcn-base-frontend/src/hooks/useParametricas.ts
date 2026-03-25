import { useCallback, useState } from 'react'
import {
  AsigLookupsService,
  Continente,
  Departamento,
  EstructuraService,
  LookupBasico,
  Localidad,
  Pais,
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
  const [paises, setPaises] = useState<Pais[]>([])
  const [paisesDestino, setPaisesDestino] = useState<Pais[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [tiposRelevancia, setTiposRelevancia] = useState<LookupBasico[]>([])
  const [tiposDenuncia, setTiposDenuncia] = useState<LookupBasico[]>([])
  const [tiposPenal, setTiposPenal] = useState<LookupBasico[]>([])
  const [tiposOperacion, setTiposOperacion] = useState<LookupBasico[]>([])
  const [tiposDroga, setTiposDroga] = useState<LookupBasico[]>([])
  const [tiposPersona, setTiposPersona] = useState<LookupBasico[]>([])
  const [tiposFabrica, setTiposFabrica] = useState<LookupBasico[]>([])
  const [tiposDocumento, setTiposDocumento] = useState<LookupBasico[]>([])
  const [tiposImplicado, setTiposImplicado] = useState<LookupBasico[]>([])
  const [tiposCabello, setTiposCabello] = useState<LookupBasico[]>([])
  const [estadosCiviles, setEstadosCiviles] = useState<LookupBasico[]>([])
  const [categoriasOperativo, setCategoriasOperativo] = useState<
    LookupBasico[]
  >([])
  const [planesOperaciones, setPlanesOperaciones] = useState<PlanOperacion[]>(
    []
  )
  const [formasTransporte, setFormasTransporte] = useState<LookupBasico[]>([])
  const [etapas, setEtapas] = useState<LookupBasico[]>([])
  const [etapasInvestigacion, setEtapasInvestigacion] = useState<
    LookupBasico[]
  >([])
  const [recursos, setRecursos] = useState<LookupBasico[]>([])
  const [sustanciasSolidasDesc, setSustanciasSolidasDesc] = useState<
    LookupBasico[]
  >([])
  const [sustanciasLiquidasDesc, setSustanciasLiquidasDesc] = useState<
    LookupBasico[]
  >([])
  const [cocaProcedencias, setCocaProcedencias] = useState<LookupBasico[]>([])
  const [cocaEstados, setCocaEstados] = useState<LookupBasico[]>([])
  const [cocaDescripciones, setCocaDescripciones] = useState<LookupBasico[]>([])
  const [bienes, setBienes] = useState<LookupBasico[]>([])
  const [calidadesBien, setCalidadesBien] = useState<LookupBasico[]>([])
  const [coloresPiel, setColoresPiel] = useState<LookupBasico[]>([])
  const [coloresOjos, setColoresOjos] = useState<LookupBasico[]>([])
  const [coloresCabello, setColoresCabello] = useState<LookupBasico[]>([])
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

  const cargarPaises = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerPaises()
      if (res.finalizado) setPaises(res.datos)
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarPaisesPorContinente = useCallback(
    async (idContinente: number) => {
      setCargando(true)
      setPaises([])
      try {
        const res =
          await SiiiLookupsService.obtenerPaisesPorContinente(idContinente)
        if (res.finalizado) setPaises(res.datos)
      } finally {
        setCargando(false)
      }
    },
    []
  )

  const cargarPaisesDestino = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerPaisesDestino()
      if (res.finalizado) setPaisesDestino(res.datos)
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

  const cargarDepartamentosPorPais = useCallback(async (idPais: number) => {
    setCargando(true)
    setDepartamentos([])
    try {
      const res = await SiiiLookupsService.obtenerDepartamentosPorPais(idPais)
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

  const cargarTiposDroga = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposDroga()
      if (res.finalizado) setTiposDroga(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTiposPersona = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposPersona()
      if (res.finalizado)
        setTiposPersona(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarEstadosCiviles = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerEstadosCiviles()
      if (res.finalizado)
        setEstadosCiviles(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarCategoriasOperativo = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerCategoriasOperativo()
      if (res.finalizado)
        setCategoriasOperativo(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTiposFabrica = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposFabrica()
      if (res.finalizado)
        setTiposFabrica(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTiposDocumento = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposDocumento()
      if (res.finalizado)
        setTiposDocumento(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTiposImplicado = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposImplicado()
      if (res.finalizado)
        setTiposImplicado(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarFormasTransporte = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerFormasTransporte()
      if (res.finalizado) setFormasTransporte(res.datos)
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarEtapas = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerEtapas()
      if (res.finalizado) setEtapas(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarEtapasInvestigacion = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerEtapasInvestigacion()
      if (res.finalizado)
        setEtapasInvestigacion(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarRecursos = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerRecursos()
      if (res.finalizado) setRecursos(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarSustanciasSolidasDesc = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerSustanciasSolidasDesc()
      if (res.finalizado)
        setSustanciasSolidasDesc(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarSustanciasLiquidasDesc = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerSustanciasLiquidasDesc()
      if (res.finalizado)
        setSustanciasLiquidasDesc(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarCocaProcedencias = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerCocaProcedencias()
      if (res.finalizado)
        setCocaProcedencias(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarCocaEstados = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerCocaEstados()
      if (res.finalizado) setCocaEstados(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarCocaDescripciones = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerCocaDescripciones()
      if (res.finalizado)
        setCocaDescripciones(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarBienes = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerBienes()
      if (res.finalizado) setBienes(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarCalidadesBien = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerCalidadesBien()
      if (res.finalizado)
        setCalidadesBien(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarColoresPiel = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerColoresPiel()
      if (res.finalizado) setColoresPiel(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarColoresOjos = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerColoresOjos()
      if (res.finalizado) setColoresOjos(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarColoresCabello = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerColoresCabello()
      if (res.finalizado)
        setColoresCabello(res.datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarTiposCabello = useCallback(async () => {
    setCargando(true)
    try {
      const res = await SiiiLookupsService.obtenerTiposCabello()
      if (res.finalizado)
        setTiposCabello(res.datos as unknown as LookupBasico[])
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
      const res =
        await SiiiLookupsService.obtenerGruposPorDistrital(idDistrital)
      if (res.finalizado) setGrupos(res.datos)
    } finally {
      setCargando(false)
    }
  }, [])

  return {
    cargando,
    // siii-lookups
    continentes,
    cargarContinentes,
    paises,
    cargarPaises,
    cargarPaisesPorContinente,
    paisesDestino,
    cargarPaisesDestino,
    departamentos,
    cargarDepartamentos,
    cargarDepartamentosPorPais,
    provincias,
    cargarProvincias,
    localidades,
    cargarLocalidades,
    tiposRelevancia,
    cargarTiposRelevancia,
    tiposDenuncia,
    cargarTiposDenuncia,
    tiposPenal,
    cargarTiposPenal,
    tiposOperacion,
    cargarTiposOperacion,
    tiposDroga,
    cargarTiposDroga,
    tiposPersona,
    cargarTiposPersona,
    tiposFabrica,
    cargarTiposFabrica,
    tiposDocumento,
    cargarTiposDocumento,
    tiposImplicado,
    cargarTiposImplicado,
    tiposCabello,
    cargarTiposCabello,
    estadosCiviles,
    cargarEstadosCiviles,
    categoriasOperativo,
    cargarCategoriasOperativo,
    planesOperaciones,
    cargarPlanesOperaciones,
    formasTransporte,
    cargarFormasTransporte,
    etapas,
    cargarEtapas,
    etapasInvestigacion,
    cargarEtapasInvestigacion,
    recursos,
    cargarRecursos,
    sustanciasSolidasDesc,
    cargarSustanciasSolidasDesc,
    sustanciasLiquidasDesc,
    cargarSustanciasLiquidasDesc,
    cocaProcedencias,
    cargarCocaProcedencias,
    cocaEstados,
    cargarCocaEstados,
    cocaDescripciones,
    cargarCocaDescripciones,
    bienes,
    cargarBienes,
    calidadesBien,
    cargarCalidadesBien,
    coloresPiel,
    cargarColoresPiel,
    coloresOjos,
    cargarColoresOjos,
    coloresCabello,
    cargarColoresCabello,
    unidadesSiii,
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
