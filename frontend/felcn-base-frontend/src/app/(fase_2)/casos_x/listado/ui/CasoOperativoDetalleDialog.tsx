'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import IconX from '@/components/Icon/IconX'
import { OperativoListadoItem } from '../types/listado.types'

type Props = {
  isOpen: boolean
  onClose: () => void
  operativo: OperativoListadoItem | null
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export const CasoOperativoDetalleDialog = ({
  isOpen,
  onClose,
  operativo,
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[black]/60 z-[999]" />
        </Transition.Child>

        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel my-8 w-full max-w-4xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">Detalle de operativo</h5>

                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={onClose}
                  >
                    <IconX />
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-12 gap-x-4 gap-y-3 text-sm">
                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Nro. caso:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.numeroCaso?.trim() || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Nro. operativo:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.numeroOperativo?.trim() || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Fecha operativo:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {formatDate(operativo?.fechaOperativo)}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Departamento:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.departamento?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Provincia:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.provincia?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Municipio:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.municipio?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Unidad:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.unidad?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Distrito:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.distrito?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Grupo:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.grupo?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Categoria:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.categoriaOperativo?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Item:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.itemOperativo?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Mando:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.mando || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Lugar:
                    </div>
                    <div className="col-span-12 md:col-span-9 whitespace-pre-wrap">
                      {operativo?.lugar || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Descripcion:
                    </div>
                    <div className="col-span-12 md:col-span-9 whitespace-pre-wrap">
                      {operativo?.descripcion || '-'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Revisado:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.revisado ? 'Si' : 'No'}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Fecha creacion:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {formatDate(operativo?.fechaCreacion)}
                    </div>

                    <div className="col-span-12 md:col-span-3 font-semibold">
                      Usuario creacion:
                    </div>
                    <div className="col-span-12 md:col-span-9">
                      {operativo?.usuarioCreacion || '-'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end px-5 pb-5">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
