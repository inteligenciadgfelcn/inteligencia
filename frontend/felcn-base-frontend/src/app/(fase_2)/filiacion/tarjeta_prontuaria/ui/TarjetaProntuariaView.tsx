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
    <div className="p-1 mb-5 w-full">
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Tarjeta Prontuaria
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      {/* <div className="px-4 pt-4">
        <h2 className="font-bold text-lg text-primary">
          Registro de Referencias
        </h2>
      </div> */}

      {/* Input Nro Caso seccion */}
      <div className="panel grid grid-cols-1 md:grid-cols-12 p-4 gap-4">
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
