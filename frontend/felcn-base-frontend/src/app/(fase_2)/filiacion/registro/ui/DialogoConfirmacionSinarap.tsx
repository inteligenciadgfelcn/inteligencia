'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import IconX from '@/components/Icon/IconX'
import {
  PayloadSinarap,
  PersonaSinarap,
  DetallePersonaSinarap,
} from '../services/sinarap.service'

interface DialogoConfirmacionSinarapProps {
  isOpen: boolean
  onClose: () => void
  payload: PayloadSinarap
  camposFaltantes: string[]
  enviando: boolean
  onConfirmar: () => void
}

interface Fila {
  etiqueta: string
  valor: string
}

const filasPersona = (persona: PersonaSinarap): Fila[] => [
  { etiqueta: 'Número de documento', valor: persona.numeroDocumento },
  { etiqueta: 'Complemento', valor: persona.complemento ?? '' },
  { etiqueta: 'Nombres', valor: persona.nombres },
  { etiqueta: 'Primer apellido', valor: persona.primerApellido },
  { etiqueta: 'Segundo apellido', valor: persona.segundoApellido },
  { etiqueta: 'Sexo', valor: String(persona.sexoId) },
  { etiqueta: 'Tipo de documento', valor: String(persona.tipoDocumentoId) },
  { etiqueta: 'Lugar de nacimiento', valor: persona.lugarNacimiento },
  { etiqueta: 'Fecha de nacimiento', valor: persona.fechaNacimiento },
  { etiqueta: 'Verificado', valor: persona.verificado },
  { etiqueta: 'Persona registro', valor: persona.personaRegistro },
]

const filasDetallePersona = (detalle: DetallePersonaSinarap): Fila[] => [
  { etiqueta: 'Profesión', valor: String(detalle.profesionId ?? '') },
  { etiqueta: 'Estado civil', valor: String(detalle.estadoCivilId ?? '') },
  { etiqueta: 'Nacionalidad', valor: String(detalle.nacionalidadId ?? '') },
  { etiqueta: 'Domicilio', valor: detalle.domicilio },
  { etiqueta: 'Peso', valor: detalle.peso },
  { etiqueta: 'Altura', valor: detalle.altura },
  { etiqueta: 'Alias', valor: detalle.aliasDenunciado },
]

const Seccion = ({ titulo, filas }: { titulo: string; filas: Fila[] }) => (
  <div className="rounded-md border border-white-light p-3">
    <h6 className="mb-2 text-sm font-bold text-primary">{titulo}</h6>
    <div className="space-y-1">
      {filas.length === 0 ? (
        <p className="text-xs text-white-dark">Sin datos.</p>
      ) : (
        filas.map((fila) => (
          <p key={fila.etiqueta} className="flex justify-between gap-4 text-sm">
            <span className="font-semibold">{fila.etiqueta}:</span>
            <span className="truncate text-right">{fila.valor || '-'}</span>
          </p>
        ))
      )}
    </div>
  </div>
)

export const DialogoConfirmacionSinarap = ({
  isOpen,
  onClose,
  payload,
  camposFaltantes,
  enviando,
  onConfirmar,
}: DialogoConfirmacionSinarapProps) => {
  const persona = payload.personas[0]?.persona
  const detallePersona = payload.personas[0]?.detallePersona

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
              <Dialog.Panel className="panel my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">
                    Confirmación de envío a SINARAP
                  </h5>

                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={onClose}
                    disabled={enviando}
                  >
                    <IconX />
                  </button>
                </div>

                <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                    <p className="text-sm font-bold text-primary">
                      Datos del antecedente
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">Código único:</span>
                        <span className="truncate text-right">
                          {payload.antecedente.codigoUnico}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">
                          Fecha y hora de ingreso:
                        </span>
                        <span className="truncate text-right">
                          {payload.antecedente.fechaHoraIngreso}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">Lugar del hecho:</span>
                        <span className="truncate text-right">
                          {payload.antecedente.lugarHecho}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">
                          Calidad de ingreso:
                        </span>
                        <span className="truncate text-right">
                          {String(payload.antecedente.calidadIngresoId)}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">
                          Número de caso interno:
                        </span>
                        <span className="truncate text-right">
                          {payload.antecedente.numeroCasoInterno}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">Fecha del hecho:</span>
                        <span className="truncate text-right">
                          {payload.antecedente.fechaHecho}
                        </span>
                      </p>
                      <p className="flex justify-between gap-4 text-sm">
                        <span className="font-semibold">Observaciones:</span>
                        <span className="truncate text-right">
                          {payload.antecedente.observaciones || '-'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {persona && (
                    <Seccion titulo="Persona" filas={filasPersona(persona)} />
                  )}
                  {detallePersona && (
                    <Seccion
                      titulo="Detalle de la persona"
                      filas={filasDetallePersona(detallePersona)}
                    />
                  )}

                  {payload.detalleFuncionario && (
                    <div className="rounded-md border border-white-light p-3">
                      <h6 className="mb-2 text-sm font-bold text-primary">
                        Detalle del funcionario
                      </h6>
                      <div className="space-y-1">
                        <p className="flex justify-between gap-4 text-sm">
                          <span className="font-semibold">
                            Número de documento:
                          </span>
                          <span className="truncate text-right">
                            {payload.detalleFuncionario.numeroDocumento}
                          </span>
                        </p>
                        <p className="flex justify-between gap-4 text-sm">
                          <span className="font-semibold">Teléfono:</span>
                          <span className="truncate text-right">
                            {payload.detalleFuncionario.detalleTelefono || '-'}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md border border-white-light p-3">
                      <h6 className="text-sm font-bold text-primary">
                        Vehículos
                      </h6>
                      <p className="mt-1 text-sm text-white-dark">
                        {payload.personas[0]?.vehiculos.length ?? 0} vehículo(s)
                      </p>
                    </div>
                    <div className="rounded-md border border-white-light p-3">
                      <h6 className="text-sm font-bold text-primary">
                        Documentos
                      </h6>
                      <p className="mt-1 text-sm text-white-dark">
                        {payload.documentos.length} documento(s)
                      </p>
                    </div>
                  </div>

                  {camposFaltantes.length > 0 && (
                    <div className="rounded-md border border-warning/40 bg-warning/10 p-3">
                      <p className="text-sm font-bold text-warning">
                        Campos faltantes (no se enviarán)
                      </p>
                      <p className="mt-1 text-xs text-white-dark">
                        El envío se realizará solo con los datos disponibles.
                      </p>
                      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                        {camposFaltantes.map((campo) => (
                          <li
                            key={campo}
                            className="truncate text-xs text-white-dark"
                          >
                            • {campo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-white-light px-5 py-4">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={onClose}
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onConfirmar}
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando...' : 'Confirmar y enviar'}
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