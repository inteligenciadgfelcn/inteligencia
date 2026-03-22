import { imprimir } from '@/utils/imprimir'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface Props {
  show: boolean
  message?: string
}

export const LoadingDialog = ({ show, message = 'Procesando...' }: Props) => {
  imprimir('Renderizando LoadingDialog con show:', show)
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={() => {}}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Centered container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#121c2c] p-6 shadow-xl flex flex-col items-center">
              {/* Spinner */}
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>

              {/* Text */}
              <p className="mt-5 text-center text-gray-700 dark:text-gray-300 font-medium">
                {message}
              </p>

              {/* Optional subtle hint */}
              <p className="mt-1 text-xs text-gray-400 text-center">
                Por favor espera un momento...
              </p>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
