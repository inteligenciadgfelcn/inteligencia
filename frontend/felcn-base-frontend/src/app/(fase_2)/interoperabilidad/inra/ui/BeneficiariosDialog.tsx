'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import IconX from '@/components/Icon/IconX'
import { InraBeneficiario } from '../services/inra.service'

interface BeneficiariosDialogProps {
  isOpen: boolean
  onClose: () => void
  beneficiarios: InraBeneficiario[]
}

const getNombreCompleto = (item: InraBeneficiario) => {
  return [item.nombres, item.primerApellido, item.segundoApellido]
    .filter(Boolean)
    .join(' ')
}

export const BeneficiariosDialog = ({
  isOpen,
  onClose,
  beneficiarios,
}: BeneficiariosDialogProps) => {
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
              <Dialog.Panel className="panel my-8 w-full max-w-2xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">Beneficiarios</h5>

                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={onClose}
                  >
                    <IconX />
                  </button>
                </div>

                <div className="p-5">
                  {beneficiarios.length === 0 && (
                    <p className="text-sm text-white-dark">
                      Sin beneficiarios.
                    </p>
                  )}

                  {beneficiarios.length > 0 && (
                    <div className="space-y-3">
                      {beneficiarios.map((item, index) => (
                        <div
                          key={`${item.numeroIdentidad}-${index}`}
                          className="rounded-md border border-white-light p-3"
                        >
                          <p className="text-sm">
                            <span className="font-semibold">Nombre:</span>{' '}
                            {getNombreCompleto(item)}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">CI:</span>{' '}
                            {item.numeroIdentidad} {item.expedicion}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Genero:</span>{' '}
                            {item.genero}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Tipo:</span>{' '}
                            {item.tipoBeneficiario}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
