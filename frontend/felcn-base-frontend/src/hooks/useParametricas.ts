import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
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
import { obtenerCatalogoConCache } from './parametricasCache'

/**
 * Hook central para consultar los datos paramétricos (lookups).
 *
 * Los catálogos fijos (sin parámetros) se sirven desde la caché
 * compartida de React Query (`staleTime: Infinity`), por lo que solo
 * se piden a la API una vez por sesión sin importar cuántos tabs o
 * componentes los usen. Los catálogos dependientes de un parámetro
 * (provincias por departamento, localidades por provincia, etc.) se
 * cachean también, con clave por parámetro.
 *
 * Uso básico:
 * ```tsx
 * const { departamentos, cargarDepartamentos, cargando } = useParametricas()
 *
 * useEffect(() => { cargarDepartamentos() }, [])
 * ```
 */
export function useParametricas() {
  const queryClient = useQueryClient()
  const [cargando, setCargando] = useState(false)

  const obtenerConCache = useCallback(
    <T,>(
      key: unknown[],
      fetchFn: () => Promise<{ finalizado: boolean; datos: T }>
    ) => obtenerCatalogoConCache(queryClient, key, fetchFn),
    [queryClient]
  )

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
  // const [grados, setGrados] = useState<LookupBasico[]>([])
  const [contenidoCaso, setContenidoCaso] = useState<LookupBasico[]>([])
  const [contenidoBien, setContenidoBien] = useState<LookupBasico[]>([])

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
      const datos = await obtenerConCache(['continentes'], () =>
        SiiiLookupsService.obtenerContinentes()
      )
      setContinentes(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarPaises = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['paises'], () =>
        SiiiLookupsService.obtenerPaises()
      )
      setPaises(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarPaisesPorContinente = useCallback(
    async (idContinente: number) => {
      setCargando(true)
      setPaises([])
      try {
        const datos = await obtenerConCache(
          ['paises', 'continente', idContinente],
          () => SiiiLookupsService.obtenerPaisesPorContinente(idContinente)
        )
        setPaises(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarPaisesDestino = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['paises-destino'], () =>
        SiiiLookupsService.obtenerPaisesDestino()
      )
      setPaisesDestino(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarDepartamentos = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['departamentos'], () =>
        SiiiLookupsService.obtenerDepartamentos()
      )
      setDepartamentos(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarDepartamentosPorPais = useCallback(
    async (idPais: number) => {
      setCargando(true)
      setDepartamentos([])
      try {
        const datos = await obtenerConCache(
          ['departamentos', 'pais', idPais],
          () => SiiiLookupsService.obtenerDepartamentosPorPais(idPais)
        )
        setDepartamentos(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarProvincias = useCallback(
    async (idDepartamento: number) => {
      setCargando(true)
      setProvincias([])
      setLocalidades([])
      try {
        const datos = await obtenerConCache(
          ['provincias', 'departamento', idDepartamento],
          () => SiiiLookupsService.obtenerProvincias(idDepartamento)
        )
        setProvincias(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarLocalidades = useCallback(
    async (idProvincia: number) => {
      setCargando(true)
      setLocalidades([])
      try {
        const datos = await obtenerConCache(
          ['localidades', 'provincia', idProvincia],
          () => SiiiLookupsService.obtenerLocalidades(idProvincia)
        )
        setLocalidades(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarTiposRelevancia = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['tipos-relevancia'], () =>
        SiiiLookupsService.obtenerTiposRelevancia()
      )
      setTiposRelevancia(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposDenuncia = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['tipos-denuncia'], () =>
        SiiiLookupsService.obtenerTiposDenuncia()
      )
      setTiposDenuncia(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposPenal = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['tipos-penal'], () =>
        SiiiLookupsService.obtenerTiposPenal()
      )
      setTiposPenal(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposOperacion = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['tipos-operacion'], () =>
        SiiiLookupsService.obtenerTiposOperacion()
      )
      setTiposOperacion(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarPlanesOperaciones = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['planes-operaciones'], () =>
        SiiiLookupsService.obtenerPlanesOperaciones()
      )
      setPlanesOperaciones(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarUnidadesSiii = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['unidades'], () =>
        SiiiLookupsService.obtenerUnidades()
      )
      setUnidadesSiii(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposDroga = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-droga'], () =>
        SiiiLookupsService.obtenerTiposDroga()
      )
      setTiposDroga(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposPersona = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-persona'], () =>
        SiiiLookupsService.obtenerTiposPersona()
      )
      setTiposPersona(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarEstadosCiviles = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['estados-civiles'], () =>
        SiiiLookupsService.obtenerEstadosCiviles()
      )
      setEstadosCiviles(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarCategoriasOperativo = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(
        ['categorias-operativo'],
        () => SiiiLookupsService.obtenerCategoriasOperativo()
      )
      setCategoriasOperativo(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposFabrica = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-fabrica'], () =>
        SiiiLookupsService.obtenerTiposFabrica()
      )
      setTiposFabrica(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposDocumento = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-documento'], () =>
        SiiiLookupsService.obtenerTiposDocumento()
      )
      setTiposDocumento(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposImplicado = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-implicado'], () =>
        SiiiLookupsService.obtenerTiposImplicado()
      )
      setTiposImplicado(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarFormasTransporte = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['formas-transporte'], () =>
        SiiiLookupsService.obtenerFormasTransporte()
      )
      setFormasTransporte(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarEtapas = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['etapas'], () =>
        SiiiLookupsService.obtenerEtapas()
      )
      setEtapas(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarEtapasInvestigacion = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(
        ['etapas-investigacion'],
        () => SiiiLookupsService.obtenerEtapasInvestigacion()
      )
      setEtapasInvestigacion(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarRecursos = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['recursos'], () =>
        SiiiLookupsService.obtenerRecursos()
      )
      setRecursos(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarSustanciasSolidasDesc = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(
        ['sustancias-solidas-desc'],
        () => SiiiLookupsService.obtenerSustanciasSolidasDesc()
      )
      setSustanciasSolidasDesc(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarSustanciasLiquidasDesc = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(
        ['sustancias-liquidas-desc'],
        () => SiiiLookupsService.obtenerSustanciasLiquidasDesc()
      )
      setSustanciasLiquidasDesc(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarCocaProcedencias = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['coca-procedencias'], () =>
        SiiiLookupsService.obtenerCocaProcedencias()
      )
      setCocaProcedencias(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarCocaEstados = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['coca-estados'], () =>
        SiiiLookupsService.obtenerCocaEstados()
      )
      setCocaEstados(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarCocaDescripciones = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['coca-descripciones'], () =>
        SiiiLookupsService.obtenerCocaDescripciones()
      )
      setCocaDescripciones(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarBienes = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['bienes'], () =>
        SiiiLookupsService.obtenerBienes()
      )
      setBienes(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarCalidadesBien = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['calidades-bien'], () =>
        SiiiLookupsService.obtenerCalidadesBien()
      )
      setCalidadesBien(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarColoresPiel = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['colores-piel'], () =>
        SiiiLookupsService.obtenerColoresPiel()
      )
      setColoresPiel(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarColoresOjos = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['colores-ojos'], () =>
        SiiiLookupsService.obtenerColoresOjos()
      )
      setColoresOjos(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarColoresCabello = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['colores-cabello'], () =>
        SiiiLookupsService.obtenerColoresCabello()
      )
      setColoresCabello(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarTiposCabello = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['tipos-cabello'], () =>
        SiiiLookupsService.obtenerTiposCabello()
      )
      setTiposCabello(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  // const cargarUnidadesAsig = useCallback(async () => {
  //   setCargando(true)
  //   try {
  //     const res = await AsigLookupsService.obtenerUnidades()
  //     if (res.finalizado) setUnidadesAsig(res.datos)
  //   } finally {
  //     setCargando(false)
  //   }
  // }, [])

  const cargarUnidadesEstructura = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache(['unidades-estructura'], () =>
        EstructuraService.obtenerUnidades()
      )
      setUnidadesEstructura(datos)
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarDistritales = useCallback(
    async (idUnidad: number) => {
      setCargando(true)
      setDistritales([])
      setGrupos([])
      try {
        const datos = await obtenerConCache(
          ['distritales', 'unidad', idUnidad],
          () => SiiiLookupsService.obtenerDistritalesPorUnidad(idUnidad)
        )
        setDistritales(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarGrupos = useCallback(
    async (idDistrital: number) => {
      setCargando(true)
      setGrupos([])
      try {
        const datos = await obtenerConCache(
          ['grupos', 'distrital', idDistrital],
          () => SiiiLookupsService.obtenerGruposPorDistrital(idDistrital)
        )
        setGrupos(datos)
      } finally {
        setCargando(false)
      }
    },
    [obtenerConCache]
  )

  const cargarContenidoCaso = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['contenido-caso'], () =>
        SiiiLookupsService.obtenerContenidoCaso()
      )
      setContenidoCaso(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

  const cargarContenidoBien = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await obtenerConCache<unknown>(['contenido-bien'], () =>
        SiiiLookupsService.obtenerContenidoBien()
      )
      setContenidoBien(datos as unknown as LookupBasico[])
    } finally {
      setCargando(false)
    }
  }, [obtenerConCache])

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
    // grados,
    // cargarGrados,
    contenidoCaso,
    cargarContenidoCaso,
    contenidoBien,
    cargarContenidoBien,
    // asig-lookups
    unidadesAsig,
    // estructura
    unidadesEstructura,
    distritales,
    grupos,
    cargarUnidadesEstructura,
    cargarDistritales,
    cargarGrupos,
  }
}
