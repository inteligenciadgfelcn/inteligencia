'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable';
import { AlertDialog } from '@/components/modales/AlertDialog';
import { Button } from '@/components/ui/Button';
import { InvestigadoresApi } from '../api/investigadores.api';
import type {
  InvestigadorCasoRow,
} from '../types/investigadores.types';
import { InvestigadorDialog } from './InvestigadorDialog';
import IconPlus from '@/components/Icon/IconPlus';
import IconEdit from '@/components/Icon/IconEdit';
import IconTrash from '@/components/Icon/IconTrash';

interface Props {
  casoId: string | number;
}

export function InvestigadoresDataTable({ casoId }: Props) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvestigador, setEditingInvestigador] =
    useState<InvestigadorCasoRow | null>(null);
  const [separarConfirm, setSepararConfirm] =
    useState<InvestigadorCasoRow | null>(null);
  const [isSeparando, setIsSeparando] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['investigadores-caso', casoId],
    enabled: Boolean(casoId),
    queryFn: () => InvestigadoresApi.listarPorCaso(casoId),
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['investigadores-caso', casoId] });
  };

  const handleSeparar = async () => {
    if (!separarConfirm) return;
    setIsSeparando(true);
    try {
      await InvestigadoresApi.separarInvestigador(
        separarConfirm.investigadorId,
        {
          fechaSeparacion: new Date().toISOString().replace('Z', '-04:00'),
        }
      );
      invalidateQueries();
      setSepararConfirm(null);
    } finally {
      setIsSeparando(false);
    }
  };

  const columns: Column<InvestigadorCasoRow>[] = [
    { accessor: 'investigadorId', title: 'ID', sortable: true },
    { accessor: 'numeroPase', title: 'Nro Pase', sortable: true },
    { accessor: 'memo', title: 'Memorándum', sortable: true },
    {
      accessor: 'fechaAsignacion',
      title: 'Fecha Asignación',
      sortable: true,
      render: (row) =>
        new Date(row.fechaAsignacion).toLocaleDateString('es-BO'),
    },
    {
      accessor: 'estadoInvestigador',
      title: 'Estado',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.estadoInvestigador === 'ASIGNADO'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : row.estadoInvestigador === 'SEPARADO'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          {row.estadoInvestigador}
        </span>
      ),
    },
    {
      accessor: 'fechaSeparacion',
      title: 'Fecha Separación',
      sortable: true,
      render: (row) =>
        row.fechaSeparacion
          ? new Date(row.fechaSeparacion).toLocaleDateString('es-BO')
          : '-',
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm !p-1.5"
            onClick={() => {
              setEditingInvestigador(row);
              setDialogOpen(true);
            }}
            title="Editar"
          >
            <IconEdit className="h-4 w-4" />
          </button>
          {row.estadoInvestigador !== 'SEPARADO' && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm !p-1.5"
              onClick={() => setSepararConfirm(row)}
              title="Separar"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h6 className="text-sm font-semibold text-dark dark:text-white-light">
          Investigadores Asignados
        </h6>
        <Button
          type="button"
          variant="primary"
          className="gap-2"
          onClick={() => {
            setEditingInvestigador(null);
            setDialogOpen(true);
          }}
        >
          <IconPlus className="h-4 w-4" />
          Agregar investigador
        </Button>
      </div>

      <VristoDataTable<InvestigadorCasoRow>
        rows={data?.investigadores ?? []}
        total={data?.total ?? 0}
        page={1}
        limit={data?.total ?? 10}
        onPageChange={() => {}}
        onLimitChange={() => {}}
        columns={columns}
        loading={isLoading || isFetching}
      />

      {!isLoading &&
        !isFetching &&
        (data?.investigadores ?? []).length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
            Sin investigadores asignados
          </p>
        )}

      <InvestigadorDialog
        open={dialogOpen}
        casoId={casoId}
        initialData={editingInvestigador}
        onClose={() => {
          setDialogOpen(false);
          setEditingInvestigador(null);
        }}
        onSuccess={() => {
          invalidateQueries();
          setDialogOpen(false);
          setEditingInvestigador(null);
        }}
      />

      <AlertDialog
        isOpen={!!separarConfirm}
        titulo="Separar investigador"
        texto={`¿Seguro que desea separar al investigador "${separarConfirm?.numeroPase}" del caso?`}
      >
        <Button
          type="button"
          variant="outline-secondary"
          disabled={isSeparando}
          onClick={() => setSepararConfirm(null)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          loading={isSeparando}
          onClick={handleSeparar}
        >
          Separar
        </Button>
      </AlertDialog>
    </div>
  );
}