'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import IconX from '@/components/Icon/IconX'
import { ParametroCRUDType } from '../types/parametrosCRUDTypes'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'

interface ModalParametroDetalleProps {
  isOpen: boolean
  onClose: () => void
  parametro: ParametroCRUDType | null
}

export const ModalParametroDetalle = ({
  isOpen,
  onClose,
  parametro,
}: ModalParametroDetalleProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        {/* FONDO */}
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

            {/* MODAL */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">

                {/* HEADER */}
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">
                    Detalles del parámetro
                  </h5>

                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={onClose}
                  >
                    <IconX />
                  </button>
                </div>

                {/* BODY */}
                <div className="p-5">
                  <div className="grid grid-cols-12 gap-y-3 text-sm">

                    <div className="col-span-4 font-semibold">Código:</div>
                    <div className="col-span-8">{parametro?.codigo}</div>

                    <div className="col-span-4 font-semibold">Nombre:</div>
                    <div className="col-span-8">{parametro?.nombre}</div>

                    <div className="col-span-4 font-semibold">Grupo:</div>
                    <div className="col-span-8">{parametro?.grupo}</div>

                    <div className="col-span-4 font-semibold">Descripción:</div>
                    <div className="col-span-8">
                      {parametro?.descripcion}
                    </div>

                    <div className="col-span-4 font-semibold">Estado:</div>
                    <div className="col-span-8">
                      <CustomMensajeEstado
                        titulo={parametro?.estado}
                        descripcion={parametro?.estado}
                        color={
                          parametro?.estado === 'ACTIVO'
                            ? 'success'
                            : parametro?.estado === 'INACTIVO'
                              ? 'error'
                              : 'info'
                        }
                      />
                    </div>

                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end px-5 pb-5">
                  <button
                    onClick={onClose}
                    type="button"
                    className="btn btn-outline-primary"
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
