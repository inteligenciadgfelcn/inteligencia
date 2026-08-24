'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RHFDate } from '@/components/form/RHFDate';
import { InvestigadoresApi } from '../api/investigadores.api';
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
  const [searchResults, setSearchResults] = useState<InvestigadorGeneralRow[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const isEditing = Boolean(initialData);

  const form = useForm<InvestigadorFormValues>({
    resolver: zodResolver(investigadorFormSchema),
    defaultValues: createDefaultInvestigadorValues(),
  });

  const filtroBusqueda = form.watch('filtroBusqueda');
  const selectedInvestigador = form.watch('selectedInvestigador');
  const estado = form.watch('estado');

  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ['investigadores-buscar', filtroBusqueda],
    enabled: Boolean(filtroBusqueda && filtroBusqueda.length >= 3 && !isEditing),
    queryFn: () =>
      InvestigadoresApi.buscarGenerales({
        pagina: 1,
        limite: 10,
        filtro: filtroBusqueda,
      }),
    staleTime: 5000,
  });

  useEffect(() => {
    if (searchData?.datos?.filas && !isEditing) {
      setSearchResults(searchData.datos.filas);
      setShowDropdown(searchData.datos.filas.length > 0);
    }
  }, [searchData, isEditing]);

  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (!open && prevOpenRef.current) {
      form.reset(createDefaultInvestigadorValues());
      setSearchResults([]);
      setShowDropdown(false);
    }
    if (open && initialData) {
      const fechaAsignacion = initialData.fechaAsignacion
        ? new Date(initialData.fechaAsignacion).toLocaleDateString('es-BO')
        : '';
      const fechaSeparacion = initialData.fechaSeparacion
        ? new Date(initialData.fechaSeparacion).toLocaleDateString('es-BO')
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

  const handleSearchChange = useCallback(
    (value: string) => {
      form.setValue('filtroBusqueda', value);
      form.setValue('numeroPase', '');
      form.setValue('selectedInvestigador', null);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (value.length >= 3 && !isEditing) {
        debounceRef.current = setTimeout(() => {
          setShowDropdown(true);
        }, 300);
      } else {
        setShowDropdown(false);
        setSearchResults([]);
      }
    },
    [form, isEditing]
  );

  const handleInvestigadorSelect = (inv: InvestigadorGeneralRow) => {
    form.setValue('selectedInvestigador', inv);
    form.setValue('numeroPase', inv.numeroPase.trim());
    form.setValue('filtroBusqueda', inv.investigador);
    setShowDropdown(false);
    setSearchResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="relative">
            <Input
              ref={searchInputRef}
              className="w-full"
              placeholder="Escriba el nro de pase para buscar..."
              value={filtroBusqueda || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={isEditing}
            />
            {isSearching && !isEditing && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>

          {showDropdown && searchResults.length > 0 && !isEditing && (
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 max-h-60 overflow-auto shadow-lg"
            >
              {searchResults.map((inv, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-sm"
                  onClick={() => handleInvestigadorSelect(inv)}
                >
                  <span>{inv.investigador}</span>
                  <span className="text-xs text-gray-500">
                    {inv.numeroPase.trim()}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedInvestigador && !isEditing && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              Seleccionado: {selectedInvestigador.investigador} (
              {selectedInvestigador.numeroPase.trim()})
            </p>
          )}

          {errors.numeroPase && (
            <p className="mt-1 text-xs text-danger">
              {errors.numeroPase.message}
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