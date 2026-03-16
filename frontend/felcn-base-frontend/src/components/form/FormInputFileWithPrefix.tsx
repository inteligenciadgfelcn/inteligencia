'use client'

import React, { useRef, useState } from 'react'
import { UseFormSetValue, UseFormRegister } from 'react-hook-form'
import { Icono } from '../Icono'

interface FileInputWithPreviewProps {
  name: string
  showPreview?: boolean
  register?: UseFormRegister<any>
  setValue?: UseFormSetValue<any>
  accept?: string
  prefix?: React.ReactNode
  icon?: string
  error?: string

  containerClassName?: string
  prefixClassName?: string
  inputClassName?: string
}
/**
 * How to use
 * <FileInputWithPreview
 *   name="documento"
 *   register={register}
 *   setValue={setValue}
 *   accept=".pdf,.png,.jpg"
 *   icon="upload_file"
 *   error={errors.documento?.message}
 * />
 *
 * How to validate with zod
 * const schema = z.object({
 *   documento: z.instanceof(File).refine(f => f.size <= 5 * 1024 * 1024, "Max 5MB")
 * })
 */
const FileInputWithPreview: React.FC<FileInputWithPreviewProps> = ({
  name,
  showPreview = false,
  register,
  setValue,
  accept,
  prefix,
  icon,
  error,
  containerClassName = '',
  prefixClassName = '',
  inputClassName = '',
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const showLeftBox = Boolean(prefix || icon)

  const openFileSelector = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected))
    } else {
      setPreview(null)
    }

    if (setValue) {
      setValue(name, selected, { shouldValidate: true })
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    if (setValue) setValue(name, null)
  }

  // Extraemos register para no duplicar ref
  const registerField =
    register &&
    register(name, {
      onChange: handleFileChange,
    })

  return (
    <div className={`${containerClassName}`}>
      <div className="flex flex-col gap-2">
        {/* INPUT PRINCIPAL */}
        <div className="flex cursor-pointer" onClick={openFileSelector}>
          {showLeftBox && (
            <div
              className={`bg-[#eee] flex items-center gap-2
              ltr:rounded-l-md rtl:rounded-r-md 
              px-1.5 font-semibold border 
              ltr:border-r-0 rtl:border-l-0 
              border-white-light 
              dark:border-[#17263c] 
              dark:bg-[#1b2e4b]
              ${prefixClassName}
              ${error ? 'border-danger' : ''}`}
            >
              {icon && <Icono fontSize="large">{icon}</Icono>}
              {prefix && <span className="text-xs">{prefix}</span>}
            </div>
          )}

          <input
            type="text"
            readOnly
            value={file?.name || ''}
            placeholder="Seleccionar archivo"
            className={`form-input flex-1 h-7 font-normal cursor-pointer
              ${showLeftBox ? 'ltr:rounded-l-none rtl:rounded-r-none' : ''}
              ${inputClassName}
              ${error ? 'border-danger focus:border-danger' : ''}`}
          />

          {/* INPUT FILE OCULTO */}
          <input
            type="file"
            accept={accept}
            hidden
            {...registerField}
            ref={(e) => {
              registerField?.ref(e)
              fileRef.current = e
            }}
          />
        </div>

        {/* PREVIEW DEL ARCHIVO */}
        {showPreview && file && (
          <div className="border border-gray-200 rounded-md p-2 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Icono fontSize="small">
                {file.type === 'application/pdf'
                  ? 'picture_as_pdf'
                  : 'description'}
              </Icono>
              <span className="text-sm truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-danger hover:opacity-70"
            >
              <Icono fontSize="small">cancel</Icono>
            </button>
          </div>
        )}

        {/* PREVIEW DE IMAGEN */}
        {showPreview && preview && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-xs h-40 border rounded-md overflow-hidden flex justify-center items-center bg-gray-50">
              <img
                src={preview}
                alt="preview"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && <span className="text-danger text-sm">{error}</span>}
      </div>
    </div>
  )
}

export default FileInputWithPreview
