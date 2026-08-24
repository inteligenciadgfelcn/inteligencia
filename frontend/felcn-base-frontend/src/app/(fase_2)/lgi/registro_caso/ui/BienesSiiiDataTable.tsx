'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable';
import { SiiiApi } from '../api/siii.api';
import type { BienSiiiRow } from '../types/siii.types';
import IconEye from '@/components/Icon/IconEye';

interface Props {
  idOperativo: string | number;
}

export function BienesSiiiDataTable({ idOperativo }: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['siii-bienes', idOperativo, page, limit, search],
    enabled: Boolean(idOperativo),
    queryFn: () => SiiiApi.listarBienes(idOperativo, { pagina: page, limite: limit }),
  });

  const columns: Column<BienSiiiRow>[] = [
    { accessor: 'id', title: 'ID', sortable: true },
    { accessor: 'descripcionBien', title: 'Descripción', sortable: true },
    { accessor: 'descripcionCatalogoTipo', title: 'Tipo', sortable: true },
    { accessor: 'descripcionCatalogoClase', title: 'Clase', sortable: true },
    { accessor: 'cantidadBien', title: 'Cantidad', sortable: true },
    {
      accessor: 'costoAproximado',
      title: 'Costo Aprox.',
      sortable: true,
      render: (row) => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(row.costoAproximado),
    },
    {
      accessor: 'enInvestigacion',
      title: 'En Investigación',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.enInvestigacion
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {row.enInvestigacion ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      accessor: 'fechaHoraIngreso',
      title: 'Fecha Ingreso',
      sortable: true,
      render: (row) => new Date(row.fechaHoraIngreso).toLocaleString(),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.urlFotoBien && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm !p-1.5"
              onClick={() => window.open(row.urlFotoBien, '_blank')}
              title="Ver foto bien"
            >
              <IconEye className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <VristoDataTable<BienSiiiRow>
      title="Bienes / Secuestros SIII"
      rows={data?.filas ?? []}
      total={data?.total ?? 0}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onLimitChange={setLimit}
      search={search}
      onSearchChange={setSearch}
      columns={columns}
      loading={isLoading || isFetching}
    />
  );
}