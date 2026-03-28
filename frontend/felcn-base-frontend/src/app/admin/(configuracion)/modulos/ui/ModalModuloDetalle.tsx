'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import IconX from '@/components/Icon/IconX'
import { ModuloCRUDType } from '../types/CrearEditarModulosType'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { Icono } from '@/components/Icono'

interface ModalModuloDetalleProps {
  isOpen: boolean
  onClose: () => void
  modulo: ModuloCRUDType | null
}

export const ModalModuloDetalle = ({
  isOpen,
  onClose,
  modulo,
}: ModalModuloDetalleProps) => {
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
                  <h5 className="text-lg font-bold">Detalles del módulo</h5>

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
                    <div className="col-span-4 font-semibold">Label:</div>
                    <div className="col-span-8 flex items-center gap-2">
                      {modulo?.propiedades?.icono && (
                        <Icono>{modulo.propiedades.icono}</Icono>
                      )}
                      {modulo?.label}
                    </div>

                    <div className="col-span-4 font-semibold">Nombre:</div>
                    <div className="col-span-8">{modulo?.nombre}</div>

                    <div className="col-span-4 font-semibold">Descripción:</div>
                    <div className="col-span-8">
                      {modulo?.propiedades?.descripcion}
                    </div>

                    <div className="col-span-4 font-semibold">URL:</div>
                    <div className="col-span-8">{modulo?.url}</div>

                    <div className="col-span-4 font-semibold">Orden:</div>
                    <div className="col-span-8">
                      {modulo?.propiedades?.orden}
                    </div>

                    <div className="col-span-4 font-semibold">Es sección:</div>
                    <div className="col-span-8">
                      {modulo?.esSeccion ? 'SI' : 'NO'}
                    </div>

                    <div className="col-span-4 font-semibold">Estado:</div>
                    <div className="col-span-8">
                      <CustomMensajeEstado
                        titulo={modulo?.estado}
                        descripcion={modulo?.estado}
                        color={
                          modulo?.estado === 'ACTIVO'
                            ? 'success'
                            : modulo?.estado === 'INACTIVO'
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
