import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Variant } from '@mui/material/styles/createTypography'
import { SubirArchivo } from '@/components/archivos/SubirArchivo'
import { filesToArray, mergeFilesList } from '@/utils'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import PdfPreview from '../preview/PdfPreview'
import { ArchivoType } from '@/types/fileType'
import { Icono } from '@/components/Icono'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { CustomDialog } from '@/components/modales/CustomDialog'

export interface FormInputFileProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  id: string
  index?: number
  name: TName
  control: Control<TFieldValues>
  tiposPermitidos?: Array<string>
  limite?: number
  multiple?: boolean
  label: string
  labelVariant?: Variant
}

interface CardFileProps {
  archivo: ArchivoType
  quitarArchivo: () => void
}

const ContenidoCardFilePreview: React.FC<{
  archivo: ArchivoType
  icono: string
  quitarArchivo: () => void
}> = React.memo(({ archivo, icono, quitarArchivo }) => (
  <Card
    variant={'outlined'}
    sx={{
      borderRadius: 3,
      height: 75,
      pl: 2,
      pr: 1,
      pt: 2,
    }}
  >
    <Stack
      direction="row"
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Icono fontSize="large">{icono}</Icono>
        <Stack direction={'column'} sx={{ display: 'grid' }}>
          <Typography
            sx={{
              width: '100%',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              WebkitLineClamp: '1',
            }}
            variant="caption"
          >
            {archivo.nombre}
          </Typography>
          <Typography variant="caption" color={'text.secondary'}>
            {(archivo.espacio / 1000 / 1000).toFixed(2)} Mb
          </Typography>
        </Stack>
      </Stack>
      <IconoTooltip
        id={`id-quitar-archivo-${archivo.nombre}`}
        color="primary"
        titulo={'Quitar archivo'}
        accion={(id) => {
          quitarArchivo()
        }}
        icono={'cancel'}
        name={'Quitar Archivo'}
      />
    </Stack>
  </Card>
))

ContenidoCardFilePreview.displayName = 'ContenidoCardFilePreview'

const CardFilePreview: React.FC<CardFileProps> = React.memo(
  ({ archivo, quitarArchivo }) => {
    const [mostrarPDF, setMostrarPDF] = useState<boolean>(false)

    const handleClick = () => {
      if (archivo.tipo === 'application/pdf') {
        setMostrarPDF(true)
      }
    }

    return (
      <>
        <CardActionArea component="span" onClick={handleClick}>
          <ContenidoCardFilePreview
            archivo={archivo}
            icono={
              archivo.tipo === 'application/pdf'
                ? 'picture_as_pdf'
                : 'description'
            }
            quitarArchivo={quitarArchivo}
          />
        </CardActionArea>
        <CustomDialog
          isOpen={mostrarPDF}
          handleClose={() => setMostrarPDF(false)}
        >
          <PdfPreview archivo={archivo} />
        </CustomDialog>
      </>
    )
  }
)

CardFilePreview.displayName = 'CardFilePreview'

const FormInputFile = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  limite = 1000,
  multiple = false,
  tiposPermitidos,
  label,
  labelVariant = 'subtitle2',
}: FormInputFileProps<TFieldValues, TName>) => {
  const [archivosCargados, setArchivosCargados] = useState<ArchivoType[]>([])
  const { field } = useController({ name, control })

  const cantidadLimite = useCallback(
    (files: FileList) => {
      const cantidadLimite = multiple ? limite : 1
      const dt = new DataTransfer()
      for (const file of Array.from(files ?? []).slice(0, cantidadLimite)) {
        dt.items.add(file)
      }
      return dt.files
    },
    [limite, multiple]
  )

  const agregarArchivos = useCallback(
    (files: FileList) => {
      const auxFiles = cantidadLimite(mergeFilesList(field.value, files))
      field.onChange(auxFiles)
      setArchivosCargados(filesToArray(auxFiles))
    },
    [field, cantidadLimite]
  )

  const quitarArchivo = useCallback(
    (index: number) => {
      setArchivosCargados((prevArchivos) => {
        const nuevosArchivos = [...prevArchivos]
        nuevosArchivos.splice(index, 1)
        const dt = new DataTransfer()
        nuevosArchivos.forEach((archivo, i) => {
          dt.items.add(field.value[i])
        })
        field.onChange(dt.files)
        return nuevosArchivos
      })
    },
    [field]
  )

  useEffect(() => {
    if (field.value) {
      setArchivosCargados(filesToArray(field.value))
    }
  }, [field.value])

  const renderArchivos = useMemo(
    () => (
      <Grid container spacing={1}>
        {archivosCargados.map((archivo, index) => (
          <Grid key={`archivo-${index}`} size={{ xs: 12, sm: 6, md: 6 }}>
            <CardFilePreview
              archivo={archivo}
              quitarArchivo={() => quitarArchivo(index)}
            />
          </Grid>
        ))}
      </Grid>
    ),
    [archivosCargados, quitarArchivo]
  )

  return (
    <Box id={id}>
      <InputLabel htmlFor={id}>
        <Typography
          variant={labelVariant}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          {label}
        </Typography>
      </InputLabel>
      {!multiple && archivosCargados.length === 1 ? (
        <Box
          sx={{
            mt: 1,
            mb: 1,
            border: '1px dashed #ABAFB3',
            padding: 2.3,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <CardFilePreview
            archivo={archivosCargados[0]}
            quitarArchivo={() => quitarArchivo(0)}
          />
        </Box>
      ) : (
        <SubirArchivo
          multiple={multiple}
          tiposPermitidos={tiposPermitidos}
          handleChange={agregarArchivos}
        />
      )}
      {multiple && <Box>{renderArchivos}</Box>}
    </Box>
  )
}

FormInputFile.displayName = 'FormInputFile'

export default FormInputFile
