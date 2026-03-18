'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import IconX from '@/components/Icon/IconX'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { CasoServicioTypeCRUD } from '../types/CasoServicioType'

interface CasoServicioDetalleProps {
  isOpen: boolean
  onClose: () => void
  casoServicio: CasoServicioTypeCRUD | null
}

export const CasoServicioDetalle = ({
  isOpen,
  onClose,
  casoServicio,
}: CasoServicioDetalleProps) => {
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
                    <div className="col-span-3 font-semibold">
                      Nro de Registro:
                    </div>
                    <div className="col-span-9">
                      {casoServicio?.nroRegistro}
                    </div>
                    <div className="col-span-3 font-semibold">
                      Código de servicio:
                    </div>
                    <div className="col-span-3">
                      {casoServicio?.codigoServicio}
                    </div>
                    <div className="col-span-3 font-semibold">Nro de pase:</div>
                    <div className="col-span-3">{casoServicio?.nroPase}</div>

                    <div className="col-span-3 font-semibold">
                      Departamento:
                    </div>
                    <div className="col-span-3">
                      {casoServicio?.departamento}
                    </div>
                    <div className="col-span-3 font-semibold">Unidad:</div>
                    <div className="col-span-3">{casoServicio?.unidad}</div>

                    <div className="col-span-3 font-semibold">Distrital:</div>
                    <div className="col-span-3">{casoServicio?.distrital}</div>
                    <div className="col-span-3 font-semibold">Grupo:</div>
                    <div className="col-span-3">{casoServicio?.grupo}</div>

                    <div className="col-span-4 font-semibold">
                      Nombre operativo:
                    </div>
                    <div className="col-span-8">
                      {casoServicio?.nombreOperativo}
                    </div>
                    <div className="col-span-4 font-semibold">
                      Fecha y Hora:
                    </div>
                    <div className="col-span-8">
                      {casoServicio?.fechaHoraOperativo}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Solicitado por:
                    </div>
                    <div className="col-span-8">
                      {casoServicio?.quienRealiza.nombreCompleto} -{' '}
                      {casoServicio?.quienRealiza.nroCelular}
                    </div>

                    <div className="col-span-4 font-semibold">Asignado a::</div>
                    <div className="col-span-8">
                      {casoServicio?.asignadoA.nombreCompleto} -{' '}
                      {casoServicio?.asignadoA.nroCelular}
                    </div>

                    <div className="col-span-4 font-semibold">
                      Fiscal asignado::
                    </div>
                    <div className="col-span-8">
                      {casoServicio?.fiscalAsignado.nombreCompleto} -
                      {casoServicio?.fiscalAsignado.nroCelular}
                    </div>

                    <div className="col-span-4 font-semibold">Estado:</div>
                    <div className="col-span-8">
                      <CustomMensajeEstado
                        titulo={casoServicio?.estado}
                        descripcion={casoServicio?.estado}
                        color={
                          casoServicio?.estado === 'ACTIVO'
                            ? 'success'
                            : casoServicio?.estado === 'INACTIVO'
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
