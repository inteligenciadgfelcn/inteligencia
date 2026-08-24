import * as z from 'zod';
import { validarFechaFormato } from '@/utils/fechas';

const dateSchema = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => validarFechaFormato(value, 'DD/MM/YYYY'), {
      message: 'La fecha no es válida',
    });

export const investigadorFormSchema = z
  .object({
    filtroBusqueda: z.string().optional(),
    estado: z.string().refine(
      (val) => ['ASIGNADO', 'SEPARADO', 'REASIGNADO'].includes(val),
      { message: 'Seleccione un estado' }
    ),
    numeroPase: z.string().min(1, 'Número de pase es requerido'),
    memo: z.string().optional(),
    fechaAsignacion: dateSchema('La fecha de asignación es requerida'),
    fechaSeparacion: z.string().optional(),
    selectedInvestigador: z.any().nullable(),
  })
  .superRefine((values, context) => {
    if (values.estado === 'SEPARADO' && !values.fechaSeparacion) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de separación es requerida cuando el estado es Separado',
        path: ['fechaSeparacion'],
      });
    }
  });

export type InvestigadorFormValues = z.infer<typeof investigadorFormSchema>;

export const createDefaultInvestigadorValues = (): InvestigadorFormValues => ({
  filtroBusqueda: '',
  estado: '',
  numeroPase: '',
  memo: '',
  fechaAsignacion: '',
  fechaSeparacion: '',
  selectedInvestigador: null,
});

export const toISOWithTimezone = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString().replace('Z', '-04:00');
  const date = new Date(`${dateStr}T12:00:00-04:00`);
  return date.toISOString().replace('Z', '-04:00');
};

export const toDisplayFormat = (isoStr: string): string => {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
