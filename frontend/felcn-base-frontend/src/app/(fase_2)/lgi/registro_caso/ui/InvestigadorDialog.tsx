'use client';

import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RHFDate } from '@/components/form/RHFDate';
import { InvestigadoresApi } from '../api/investigadores.api';
import { InvestigadorCombobox } from '../../components/InvestigadorCombobox';
import { formatFecha } from '../../utils/fechas';
import type {
  InvestigadorCasoRow,
  InvestigadorGeneralRow,
  InvestigadorFormValues,
} from '../types/investigadores.types';
import {
  investigadorFormSchema,
  createDefaultInvestigadorValues,
  toISOWithTimezone,
} from '../schemas/investigadores.schema';

interface Props {
  open: boolean;
  casoId: string | number;
  initialData?: InvestigadorCasoRow | null;
  onClose: () => void;
  onSuccess: () => void;
}

const estadoOptions = [
  { value: 'ASIGNADO', label: 'Asignado' },
  { value: 'SEPARADO', label: 'Separado' },
  { value: 'REASIGNADO', label: 'Reasignado' },
];

export function InvestigadorDialog({
  open,
  casoId,
  initialData,
  onClose,
  onSuccess,
}: Props) {
  const [guardando, setGuardando] = useState(false);

  const isEditing = Boolean(initialData);

  const form = useForm<InvestigadorFormValues>({
    resolver: zodResolver(investigadorFormSchema),
    defaultValues: createDefaultInvestigadorValues(),
  });

  const filtroBusqueda = form.watch('filtroBusqueda');
  const selectedInvestigador = form.watch('selectedInvestigador');
  const estado = form.watch('estado');

  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (!open && prevOpenRef.current) {
      form.reset(createDefaultInvestigadorValues());
    }
    if (open && initialData) {
      const fechaAsignacion = initialData.fechaAsignacion
        ? formatFecha(initialData.fechaAsignacion, 'dd/MM/yyyy')
        : '';
      const fechaSeparacion = initialData.fechaSeparacion
        ? formatFecha(initialData.fechaSeparacion, 'dd/MM/yyyy')
        : '';

      form.reset({
        filtroBusqueda: initialData.numeroPase,
        estado: initialData.estadoInvestigador,
        numeroPase: initialData.numeroPase,
        memo: initialData.memo || '',
        fechaAsignacion,
        fechaSeparacion,
        selectedInvestigador: null,
      });
    }
    if (open && !initialData) {
      form.reset(createDefaultInvestigadorValues());
    }
    prevOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleInputChange = (value: string) => {
    form.setValue('filtroBusqueda', value);
    form.setValue('numeroPase', '');
    form.setValue('selectedInvestigador', null);
  };

  const handleInvestigadorSelect = (inv: InvestigadorGeneralRow) => {
    form.setValue('selectedInvestigador', inv);
    form.setValue('numeroPase', inv.numeroPase.trim());
    form.setValue('filtroBusqueda', `${inv.investigador} - ${inv.numeroPase.trim()}`);
  };

  const onSubmitForm = async (values: InvestigadorFormValues) => {
    setGuardando(true);
    try {
      const now = new Date().toISOString().split('T')[0];

      if (isEditing && initialData) {
        if (values.estado === 'SEPARADO') {
          await InvestigadoresApi.separarInvestigador(
            initialData.investigadorId,
            {
              fechaSeparacion: values.fechaSeparacion
                ? toISOWithTimezone(values.fechaSeparacion)
                : toISOWithTimezone(now),
            }
          );
        } else {
          await InvestigadoresApi.asignarInvestigador(casoId, {
            numeroPase: initialData.numeroPase,
            memo: values.memo || '',
            fechaAsignacion: values.fechaAsignacion
              ? toISOWithTimezone(values.fechaAsignacion)
              : toISOWithTimezone(now),
          });
        }
      } else {
        if (!values.numeroPase) {
          form.setError('numeroPase', {
            type: 'manual',
            message: 'Seleccione un investigador de la búsqueda',
          });
          setGuardando(false);
          return;
        }

        await InvestigadoresApi.asignarInvestigador(casoId, {
          numeroPase: values.numeroPase,
          memo: values.memo || '',
          fechaAsignacion: values.fechaAsignacion
            ? toISOWithTimezone(values.fechaAsignacion)
            : toISOWithTimezone(now),
        });
      }

      onSuccess();
    } finally {
      setGuardando(false);
    }
  };

  const { errors } = form.formState;
  const showFechaSeparacion = estado === 'SEPARADO';

  return (
    <CustomDialog
      isOpen={open}
      handleClose={onClose}
      title={isEditing ? 'Editar Investigador' : 'Registrar Investigador'}
      maxWidth="lg"
    >
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="space-y-4 p-5"
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
            Buscar por nro de pase
          </label>
          <InvestigadorCombobox
            id="buscar-investigador"
            value={filtroBusqueda || ''}
            placeholder="Escriba el nro de pase para buscar..."
            disabled={isEditing}
            showSelected
            error={errors.numeroPase?.message}
            onInputChange={handleInputChange}
            onSelect={handleInvestigadorSelect}
          />
          {selectedInvestigador && !isEditing && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              Seleccionado: {selectedInvestigador.investigador} (
              {selectedInvestigador.numeroPase.trim()})
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Estado
            </label>
            <select
              {...form.register('estado')}
              className="form-select w-full"
            >
              <option value="">Seleccione...</option>
              {estadoOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="mt-1 text-xs text-danger">{errors.estado.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              Nro Memorandum
            </label>
            <Input
              {...form.register('memo')}
              className="w-full"
              placeholder="Número de memorándum"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <RHFDate
            id="fechaAsignacion"
            name="fechaAsignacion"
            control={form.control}
            label="Fecha Asignación"
            clearable
          />

          {showFechaSeparacion && (
            <RHFDate
              id="fechaSeparacion"
              name="fechaSeparacion"
              control={form.control}
              label="Fecha Separación"
              clearable
            />
          )}
        </div>

        <input type="hidden" {...form.register('numeroPase')} />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            disabled={guardando}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={guardando}>
            {isEditing ? 'Actualizar' : 'Registrar'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}