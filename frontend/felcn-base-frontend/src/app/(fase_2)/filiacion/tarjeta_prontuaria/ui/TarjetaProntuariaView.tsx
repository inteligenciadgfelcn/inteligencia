'use client'

import { useEffect, useState } from 'react'
import { FiliacionPersonaTable } from '../../registro/type/filiacion.persona.table'
import { TablePersonas } from '../../shared/TablePersonas'
import { imprimir } from '@/utils/imprimir'
import { useAlerts } from '@/hooks'
import { getPersonasFiliacionPorCaso } from '../../registro/services/filiacion.service'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { VristoSimpleDataTable } from '@/components/datatable/VristoSimpleDataTable'
import IconDownload from '@/components/Icon/IconDownload'
import IconFile from '@/components/Icon/IconFile'
import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'
import { IconoTooltip } from '@/components/botones/IconoTooltip'

export const TarjetaProntuariaView = () => {
  const [refreshKey] = useState(0)

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
        1
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

  const handleSelected = async (
    filiacionPersonaTable: FiliacionPersonaTable | undefined
  ) => {
    if (!filiacionPersonaTable) {
      return
    }
    try {
      const response = await sesionPeticion({
        url: `${Constantes.baseUrl}/reporte/export/pdf/${filiacionPersonaTable?.id_detenido}`,
        withCredentials: true,
        responseType: 'arraybuffer',
      })

      const blob = new Blob([response], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)

      const newTab = window.open()
      if (newTab) {
        newTab.location.href = url
      } else {
        throw new Error('No se pudo abrir una nueva pestaña')
      }

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al intentar abrir el PDF:', error)
    }
  }

  useEffect(() => {
    handleSelected(selectedFiliacion ?? undefined)
  }, [selectedFiliacion])

  useEffect(() => {
    handleGetPersonas()
  }, [refreshKey])

  const columns = [
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
      accessor: 'acciones',
      title: 'Acciones',
      render: (row: FiliacionPersonaTable) => {
        const isSelected =
          selectedFiliacion?.id_persona_auxiliar == row.id_persona_auxiliar

        return (
          <IconoTooltip
            id="1"
            titulo={'Generar reporte'}
            color={'info'}
            accion={() => {
              handleSelected(row)
            }}
            icono={'download'}
            name={'Generar reporte'}
          />
        )
      },
    },
  ]

  return (
    <div className="panel p-1 mb-5 w-full">
      {/* <div className="px-4 pt-4">
        <h2 className="font-bold text-lg text-primary">
          Registro de Referencias
        </h2>
      </div> */}

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
