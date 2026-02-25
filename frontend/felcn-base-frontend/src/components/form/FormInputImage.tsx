import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Box,
  Card,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { IconoTooltip } from '../botones/IconoTooltip'
import ImagenPreview from '../preview/ImagenPreview'
import { SubirArchivo } from '../archivos/SubirArchivo'
import { filesToArray, mergeFilesList } from '@/utils'
import { ArchivoType } from '@/types/fileType'

export interface FormInputImageProps<
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

const SingleImagePreview: React.FC<{
  archivo: ArchivoType
  onRemove: () => void
}> = React.memo(({ archivo, onRemove }) => (
  <Card
    variant={'outlined'}
    sx={{
      borderRadius: 3,
      p: 2,
    }}
  >
    <Stack
      direction="row"
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Stack direction={'row'} spacing={2} alignItems={'flex-start'}>
        <Box width={80} height={80}>
          <ImagenPreview
            width={'100'}
            height={'100'}
            alt={archivo.nombre}
            src={archivo.imgUrlLocal}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Box>
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
            variant="inherit"
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
        accion={onRemove}
        icono={'cancel'}
        name={'Quitar Archivo'}
      />
    </Stack>
  </Card>
))

SingleImagePreview.displayName = 'SingleImagePreview'

const FormInputImage = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  id,
  name,
  control,
  limite = 1000,
  multiple = false,
  tiposPermitidos = ['png', 'jpg', 'jpeg', 'svg'],
  label,
  labelVariant = 'subtitle2',
}: FormInputImageProps<TFieldValues, TName>) => {
  const [archivosCargados, setArchivosCargados] = useState<ArchivoType[]>([])
  const { field } = useController({ name, control })
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

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
        const nuevosArchivos = prevArchivos.filter((_, i) => i !== index)
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

  const renderSingleImage = useMemo(() => {
    if (!multiple && archivosCargados.length === 1) {
      return (
        <Box
          sx={{
            mt: 1,
            mb: 1,
            border: '1px dashed #ABAFB3',
            padding: 2,
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
          alignItems="center"
          justifyContent="center"
        >
          <SingleImagePreview
            archivo={archivosCargados[0]}
            onRemove={() => quitarArchivo(0)}
          />
        </Box>
      )
    }
    return null
  }, [multiple, archivosCargados, quitarArchivo])

  const renderImageList = useMemo(() => {
    if (multiple) {
      return (
        <ImageList cols={xs ? 2 : 3}>
          {archivosCargados.map((item, index) => (
            <ImageListItem key={item.imgUrlLocal}>
              <ImagenPreview
                width={'200'}
                height={'200'}
                alt={item.nombre}
                src={item.imgUrlLocal}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                position="top"
                title={item.nombre}
                subtitle={`${(item.espacio / 1000000).toFixed(2)} Mb`}
                actionPosition="right"
                actionIcon={
                  <Box component="span" sx={{ p: 1 }}>
                    <IconoTooltip
                      id={`id-quitar-archivo-${index}`}
                      color="error"
                      titulo={'Quitar archivo'}
                      accion={() => quitarArchivo(index)}
                      icono={'remove_circle'}
                      name={'Quitar Archivo'}
                    />
                  </Box>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )
    }
    return null
  }, [multiple, archivosCargados, xs, quitarArchivo])

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
      {renderSingleImage || (
        <SubirArchivo
          multiple={multiple}
          tiposPermitidos={tiposPermitidos}
          handleChange={agregarArchivos}
        />
      )}
      {renderImageList}
    </Box>
  )
}

FormInputImage.displayName = 'FormInputImage'

export default FormInputImage
