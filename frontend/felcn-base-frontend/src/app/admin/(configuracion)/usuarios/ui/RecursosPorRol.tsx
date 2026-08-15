'use client'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'

interface SubModuloRecurso {
  id: string
  label: string
  excluido: boolean
}

interface ModuloRecurso {
  id: string
  label: string
  subModulo: SubModuloRecurso[]
}

interface RecursosPorRolProps {
  idRol: string
  codigoRol: string
  nombreRol: string
  idUsuarioRol?: string
  onChange: (idRol: string, idsModuloExcluidos: string[]) => void
}

/**
 * Por cada rol seleccionado en el formulario de usuario, permite elegir entre
 * dejarle todos los recursos del rol (default) o personalizar cuáles
 * checkboxes marcados = tiene acceso, destildado = excluido para este
 * usuario+rol puntual (no afecta al resto de usuarios con el mismo rol).
 */
export const RecursosPorRol = ({
  idRol,
  codigoRol,
  nombreRol,
  idUsuarioRol,
  onChange,
}: RecursosPorRolProps) => {
  const { sesionPeticion } = useSession()
  const [modo, setModo] = useState<'todos' | 'personalizado'>('todos')
  const [habilitados, setHabilitados] = useState<Set<string>>(new Set())
  const [inicializado, setInicializado] = useState(false)

  const obtenerRecursos = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/recursos`,
      params: { rol: codigoRol, ...(idUsuarioRol ? { idUsuarioRol } : {}) },
    })
    return (respuesta.datos ?? []) as ModuloRecurso[]
  }

  const { data: catalogo = [], isLoading } = useQuery({
    queryKey: ['recursos-rol', codigoRol, idUsuarioRol],
    queryFn: obtenerRecursos,
  })

  // Inicializa modo/habilitados una sola vez, cuando llega el catálogo:
  // si ya había excepciones guardadas, arranca en "Personalizar" reflejándolas.
  useEffect(() => {
    if (inicializado || catalogo.length === 0) return
    const todosLosSubModulo = catalogo.flatMap((modulo) => modulo.subModulo)
    const hayExcepciones = todosLosSubModulo.some((sub) => sub.excluido)
    setModo(hayExcepciones ? 'personalizado' : 'todos')
    setHabilitados(
      new Set(
        todosLosSubModulo
          .filter((sub) => !sub.excluido)
          .map((sub) => sub.id)
      )
    )
    setInicializado(true)
  }, [catalogo, inicializado])

  // Reporta al formulario padre el conjunto de módulos excluidos vigente.
  useEffect(() => {
    if (!inicializado) return
    if (modo === 'todos') {
      onChange(idRol, [])
      return
    }
    const todosLosIds = catalogo.flatMap((modulo) =>
      modulo.subModulo.map((sub) => sub.id)
    )
    const excluidos = todosLosIds.filter((id) => !habilitados.has(id))
    onChange(idRol, excluidos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo, habilitados, inicializado, idRol])

  const alternarModulo = (id: string) => {
    setHabilitados((previo) => {
      const siguiente = new Set(previo)
      if (siguiente.has(id)) {
        siguiente.delete(id)
      } else {
        siguiente.add(id)
      }
      return siguiente
    })
  }

  return (
    <div className="border border-[#ebedf2] dark:border-[#1b2e4b] rounded-lg p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-dark dark:text-white-light">
          {nombreRol}
        </span>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              className="form-radio"
              checked={modo === 'todos'}
              onChange={() => setModo('todos')}
            />
            Todos los recursos (por defecto)
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              className="form-radio"
              checked={modo === 'personalizado'}
              onChange={() => setModo('personalizado')}
            />
            Personalizar
          </label>
        </div>
      </div>

      {modo === 'personalizado' && (
        <div className="mt-3 space-y-3">
          {isLoading && (
            <p className="text-sm text-gray-500">Cargando recursos...</p>
          )}
          {!isLoading && catalogo.length === 0 && (
            <p className="text-sm text-gray-500">
              Este rol no tiene recursos de pantalla configurados.
            </p>
          )}
          {catalogo.map((modulo) => (
            <div key={modulo.id}>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                {modulo.label}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {modulo.subModulo.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary"
                      checked={habilitados.has(sub.id)}
                      onChange={() => alternarModulo(sub.id)}
                    />
                    {sub.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
