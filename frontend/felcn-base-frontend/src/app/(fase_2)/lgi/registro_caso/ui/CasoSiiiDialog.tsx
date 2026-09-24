'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable';
import { SiiiApi } from '../api/siii.api';
import type {
  ConsultaSiiiQueryDto,
  ResultadoBusquedaAvanzada,
} from '../types/siii.types';
import { DetalleCasoSiii } from './DetalleCasoSiii';
import IconEye from '@/components/Icon/IconEye';

interface Props {
  filtro: ConsultaSiiiQueryDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatearCosto = (valor: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  }).format(valor);

export function CasoSiiiDialog({ filtro, isOpen, onClose }: Props) {
  const [seleccionado, setSeleccionado] =
    useState<ResultadoBusquedaAvanzada | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: filas, isLoading, isError } = useQuery({
    queryKey: ['siii-avanzado', filtro],
    enabled: Boolean(isOpen && filtro),
    queryFn: () => SiiiApi.buscarAvanzado(filtro!),
  });

  useEffect(() => {
    setSeleccionado(null);
    setPage(1);
  }, [filtro, isOpen]);

  const columnas: Column<ResultadoBusquedaAvanzada>[] = [
    { accessor: 'numeroCaso', title: 'Nro Caso', sortable: true },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del caso',
      sortable: true,
      render: (row) => <span className="font-medium">{row.nombreCaso}</span>,
    },
    { accessor: 'fechaOperativo', title: 'Fecha operativo', sortable: true },
    { accessor: 'numeroOperativo', title: 'Nro Operativo', sortable: true },
    { accessor: 'ubicacionInstitucional', title: 'Ubicación' },
    {
      accessor: 'costoTotalAproximadoBienes',
      title: 'Costo aprox.',
      sortable: true,
      render: (row) => formatearCosto(row.costoTotalAproximadoBienes),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm !p-1.5"
          title="Ver detalle"
          onClick={() => setSeleccionado(row)}
        >
          <IconEye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <CustomDialog
      isOpen={isOpen}
      handleClose={onClose}
      title="Antecedentes SIII"
      paperProps={{ style: { maxWidth: '80%', width: '80%' } }}
      maxWidth="xl"
    >
      <div className="p-4">
        {!seleccionado ? (
          <>
            {isError && (
              <div className="mb-4 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                Ocurrió un error al consultar los antecedentes SIII.
              </div>
            )}
            <VristoDataTable<ResultadoBusquedaAvanzada>
              title="Resultados de la búsqueda"
              rows={filas ?? []}
              total={filas?.length ?? 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
              columns={columnas}
              loading={isLoading}
            />
          </>
        ) : (
          <DetalleCasoSiii
            caso={seleccionado}
            onBack={() => setSeleccionado(null)}
          />
        )}
      </div>
    </CustomDialog>
  );
}