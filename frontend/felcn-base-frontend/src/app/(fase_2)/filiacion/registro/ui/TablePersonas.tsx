'use client'

import { useState } from 'react'
import { getPersonasFiliacionPorCaso } from '../services/filiacion.service'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'
import { useAlerts } from '@/hooks'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import { on } from 'events'

interface Props {
  // caso?: CasoServicioTypeCRUD | null
  onSelected: (data?: FiliacionPersonaTable) => void
}

export const TablePersonas = ({ onSelected }: Props) => {
  const { Alerta } = useAlerts()
  const [nroCaso, setNroCaso] = useState<string | null>(null)
  const [loadingPersonas, setLoadingPersonas] = useState(false)
  const [selectedFiliacion, setSelectedFiliacion] =
    useState<FiliacionPersonaTable | null>(null)

  const [personasData, setPersonasData] = useState<FiliacionPersonaTable[]>([])

  /* FETCH */
  const handleGetPersonas = async () => {
    if (!nroCaso) return
    setLoadingPersonas(true)
    try {
      const response = await getPersonasFiliacionPorCaso(
        {
          pagina: 1,
          limite: 50,
          filtro: undefined,
          ordenar: '',
          direccion: '',
        },
        nroCaso,
        0
      )
      setPersonasData(response.datos.filas)
      setSelectedFiliacion(null)
    } catch (error) {
      Alerta({
        mensaje: 'No se pudo cargar las personas',
        variant: 'error',
      })
    } finally {
      setLoadingPersonas(false)
    }
  }

  const cleanInput = () => {
    setNroCaso(null)
    setPersonasData([])
  }

  const toggleSelected = (persona: FiliacionPersonaTable) => {
    setSelectedFiliacion((prev) => {
      const data =
        prev?.id_persona_auxiliar == persona.id_persona_auxiliar
          ? null
          : persona
      onSelected(data ?? undefined)
      return data
    })
  }

  const columns = [
    {
      accessor: 'id_persona_auxiliar',
      title: 'ID',
    },
    {
      accessor: 'nombres',
      title: 'Nombres',
    },
    {
      accessor: 'apellido_paterno',
      title: 'Ap. Paterno',
    },
    {
      accessor: 'apellido_materno',
      title: 'Ap. Materno',
    },
    {
      accessor: 'apellido_esposo',
      title: 'Ap. Casada',
    },
    {
      accessor: 'pais',
      title: 'Nacionalidad',
    },
    {
      accessor: 'genero',
      title: 'Sexo',
    },
    {
      accessor: 'tipo_documento',
      title: 'Tipo Doc',
    },
    {
      accessor: 'numero_documento',
      title: 'Número Documento',
    },
    {
      accessor: 'fecha_nacimiento',
      title: 'Fecha Nacimiento',
    },
    {
      accessor: 'direccion',
      title: 'Dirección',
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: FiliacionPersonaTable) => {
        const isSelected =
          selectedFiliacion?.id_persona_auxiliar == row.id_persona_auxiliar

        return (
          <button
            type="button"
            className={`btn btn-sm m-1 ${
              isSelected ? 'btn-outline-danger' : 'btn-outline-primary'
            }`}
            onClick={() => toggleSelected(row)}
          >
            {isSelected ? 'Deseleccionar' : 'Seleccionar'}
          </button>
        )
      },
    },
  ]

  return (
    <div className="panel p-1 mb-5 w-full">
      <div className="px-4 pt-4">
        <h2 className="font-bold text-lg text-primary">Registro de Personas</h2>
      </div>

      {/* Input Nro Caso seccion */}
      <div className="grid grid-cols-1 md:grid-cols-12 p-4 gap-4">
        <div className="col-span-4">
          <InputWithPrefix
            name="numeroCaso"
            prefix="Número de Caso"
            value={nroCaso ?? ''}
            onChange={(e) => setNroCaso(e.target.value)}
          />
        </div>
        <div className="flex col-span-6">
          {personasData.length == 0 && (
            <button
              type="button"
              className="btn btn-primary btn-sm mr-2"
              onClick={handleGetPersonas}
            >
              BUSCAR
            </button>
          )}
          {personasData.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={cleanInput}
            >
              NUEVO INGRESO
            </button>
          )}
        </div>
      </div>

      {/* Tabla de Personas Filiacion */}
      {personasData.length > 0 && (
        <div className="px-2">
          <VristoSimpleDataTable<FiliacionPersonaTable>
            rows={personasData}
            columns={columns}
            loading={loadingPersonas}
            rowClassName={(row) =>
              selectedFiliacion?.id_persona_auxiliar === row.id_persona_auxiliar
                ? 'bg-blue-100 dark:bg-blue-900'
                : ''
            }
          />
        </div>
      )}
    </div>
  )
}
