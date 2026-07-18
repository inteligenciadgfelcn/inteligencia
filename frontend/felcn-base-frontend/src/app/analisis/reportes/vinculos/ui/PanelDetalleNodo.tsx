'use client'

import IconFolder from '@/components/Icon/IconFolder'
import IconUser from '@/components/Icon/IconUser'
import IconUsersGroup from '@/components/Icon/IconUsersGroup'
import IconBox from '@/components/Icon/IconBox'
import IconX from '@/components/Icon/IconX'
import type { NodoVinculo } from './construirGrafo'

interface Props {
  nodo: NodoVinculo | null
  onCerrar: () => void
}

const fmt = (f: string | null | undefined) => {
  if (!f) return 'N/A'
  const d = new Date(f)
  return isNaN(d.getTime()) ? f : d.toLocaleDateString('es-BO')
}

const Fila = ({ label, valor }: { label: string; valor: string | null | undefined }) => (
  <tr className="border-b border-[#e5e7eb] dark:border-[#1b2e4b]">
    <td className="w-32 py-1 pr-3 align-top font-semibold text-[#3e5f8a]">{label}</td>
    <td className="py-1">{valor || '—'}</td>
  </tr>
)

const ICONO_POR_TIPO = {
  caso: IconFolder,
  blanco: IconUser,
  empresa: IconUsersGroup,
  bien: IconBox,
}

const TITULO_POR_TIPO = {
  caso: 'Caso',
  blanco: 'Investigado',
  empresa: 'Organización',
  bien: 'Bien Investigado',
}

export function PanelDetalleNodo({ nodo, onCerrar }: Props) {
  if (!nodo) {
    return (
      <div className="panel flex h-full min-h-[300px] items-center justify-center p-5 text-center text-xs italic text-gray-400">
        Seleccione un nodo del grafo para ver su detalle.
      </div>
    )
  }

  const Icono = ICONO_POR_TIPO[nodo.entidad.tipo]

  return (
    <div className="panel p-0">
      <div className="flex items-center justify-between border-b border-[#e0e6ed] px-4 py-3 dark:border-[#1b2e4b]">
        <div className="flex items-center gap-2">
          <Icono className="h-4 w-4 text-[#3e5f8a]" />
          <span className="text-sm font-semibold uppercase text-[#3e5f8a]">
            {TITULO_POR_TIPO[nodo.entidad.tipo]}
          </span>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#1b2e4b]"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[600px] overflow-y-auto p-4">
        {nodo.entidad.tipo === 'caso' && (
          <table className="w-full text-sm">
            <tbody>
              <Fila label="Nombre" valor={nodo.entidad.data.nombreCaso} />
              <Fila label="Nro. CER" valor={nodo.entidad.data.nroCasoCer} />
              <Fila label="País" valor={nodo.entidad.data.pais} />
              <Fila label="Lugar" valor={nodo.entidad.data.lugar} />
              <Fila label="Estado" valor={nodo.entidad.data.estadoCaso} />
              <Fila label="Etapa" valor={nodo.entidad.data.etapaInvestigacion} />
              <Fila label="Fecha Inicio" valor={fmt(nodo.entidad.data.fechaInicio)} />
              <Fila label="Antecedentes" valor={nodo.entidad.data.antecedentes} />
            </tbody>
          </table>
        )}

        {nodo.entidad.tipo === 'blanco' && (
          <>
            <table className="mb-3 w-full text-sm">
              <tbody>
                <Fila label="Nombre(s)" valor={nodo.entidad.data.deNombres} />
                <Fila label="Ap. Paterno" valor={nodo.entidad.data.dePaterno} />
                <Fila label="Ap. Materno" valor={nodo.entidad.data.deMaterno} />
                <Fila label="Ap. Esposo" valor={nodo.entidad.data.deEsposo} />
                <Fila label="Alias" valor={nodo.entidad.data.alias} />
                <Fila label="Nacionalidad" valor={nodo.entidad.data.descripcionPais} />
              </tbody>
            </table>

            <p className="mb-1 text-xs font-bold uppercase text-[#1e3a8a]">Antecedentes</p>
            {nodo.entidad.data.antecedentes.length === 0 ? (
              <p className="mb-3 text-xs italic text-gray-400">Sin antecedentes registrados.</p>
            ) : (
              <ul className="mb-3 list-inside list-disc text-xs">
                {nodo.entidad.data.antecedentes.map((a, i) => (
                  <li key={i}>
                    {a.descripcionTipoDelito ?? 'N/A'} — {a.lugarHecho} ({fmt(a.fechaHecho)})
                  </li>
                ))}
              </ul>
            )}

            <p className="mb-1 text-xs font-bold uppercase text-[#1e3a8a]">Redes Sociales</p>
            {nodo.entidad.data.redesSociales.length === 0 ? (
              <p className="text-xs italic text-gray-400">Sin redes sociales registradas.</p>
            ) : (
              <ul className="list-inside list-disc text-xs">
                {nodo.entidad.data.redesSociales.map((r, i) => (
                  <li key={i}>
                    {r.tipoRed}: {r.direccion}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {nodo.entidad.tipo === 'empresa' && (
          <table className="w-full text-sm">
            <tbody>
              <Fila label="Tipo" valor={nodo.entidad.data.descripcionTipoOrganizacion} />
              <Fila label="Nombre" valor={nodo.entidad.data.nombre} />
              <Fila label="NIT" valor={nodo.entidad.data.nit} />
              <Fila label="Matrícula" valor={nodo.entidad.data.matricula} />
              <Fila label="Representante" valor={nodo.entidad.data.representante} />
              <Fila label="Observaciones" valor={nodo.entidad.data.observaciones} />
            </tbody>
          </table>
        )}

        {nodo.entidad.tipo === 'bien' && (
          <>
            <table className="mb-3 w-full text-sm">
              <tbody>
                <Fila label="Bien" valor={nodo.entidad.data.descripcionBien} />
                <Fila label="Clase" valor={nodo.entidad.data.descripcionClase} />
                <Fila label="Tipo" valor={nodo.entidad.data.descripcionTipo} />
                <Fila
                  label="Investigación"
                  valor={nodo.entidad.data.descripcionTipoInvestigacion}
                />
              </tbody>
            </table>

            <p className="mb-1 text-xs font-bold uppercase text-[#1e3a8a]">Características</p>
            {nodo.entidad.data.caracteristicas.length === 0 ? (
              <p className="text-xs italic text-gray-400">Sin características registradas.</p>
            ) : (
              <ul className="list-inside list-disc text-xs">
                {nodo.entidad.data.caracteristicas.map((c, i) => (
                  <li key={i}>
                    {c.descripcionCaracteristica ?? 'N/A'}: {c.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
