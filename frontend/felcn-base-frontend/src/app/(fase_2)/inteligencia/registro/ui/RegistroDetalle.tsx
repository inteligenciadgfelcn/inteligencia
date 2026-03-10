'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import IconX from '@/components/Icon/IconX'
import { AsignacionTable } from '../types/RegistroType'

interface RegistroDetalleProps {
  isOpen: boolean
  onClose: () => void
  registro: AsignacionTable | null
}

export const RegistroDetalle = ({
  isOpen,
  onClose,
  registro,
}: RegistroDetalleProps) => {
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
                    Detalles del caso de servicio
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
                    <div className="col-span-4 font-semibold">
                      Nro de Registro:
                    </div>
                    <div className="col-span-8">
                      {registro?.idAsignacion ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Codigo de servicio:
                    </div>
                    <div className="col-span-8">
                      {registro?.codigoServicio ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Nro Operativo:
                    </div>
                    <div className="col-span-8">
                      {registro?.nroOperativo ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Departamento:
                    </div>
                    <div className="col-span-8">
                      {registro?.departamento?.descripcion ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">Unidad:</div>
                    <div className="col-span-8">
                      {registro?.grupo?.distrital?.unidad?.descripcion ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Nombre del caso:
                    </div>
                    <div className="col-span-8">
                      {registro?.nombreCaso ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Fecha y hora:
                    </div>
                    <div className="col-span-8">
                      {registro?.fechaSolicitud
                        ? new Date(registro.fechaSolicitud).toLocaleString()
                        : '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Solicitado por:
                    </div>
                    <div className="col-span-8">
                      {registro?.nombreSolicitud ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Telefono solicitante:
                    </div>
                    <div className="col-span-8">
                      {registro?.telefonoSolicitud ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">Asignado a:</div>
                    <div className="col-span-8">
                      {registro?.asignado ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Telefono asignado:
                    </div>
                    <div className="col-span-8">
                      {registro?.telefonoAsignado ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Fiscal asignado:
                    </div>
                    <div className="col-span-8">
                      {registro?.fiscalAsignado ?? '-'}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Telefono fiscal:
                    </div>
                    <div className="col-span-8">
                      {registro?.telefonoFiscal ?? '-'}
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
