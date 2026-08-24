'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable';
import { SiiiApi } from '../api/siii.api';
import type { PersonaSiiiRow } from '../types/siii.types';
import IconEye from '@/components/Icon/IconEye';
import IconGallery from '@/components/Icon/IconGallery';

interface Props {
  idOperativo: string | number;
}

export function PersonasSiiiDataTable({ idOperativo }: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['siii-personas', idOperativo, page, limit, search],
    enabled: Boolean(idOperativo),
    queryFn: () => SiiiApi.listarPersonas(idOperativo, { pagina: page, limite: limit }),
  });

  const columns: Column<PersonaSiiiRow>[] = [
    { accessor: 'id', title: 'ID', sortable: true },
    {
      accessor: 'nombreCompleto',
      title: 'Nombre completo',
      sortable: true,
      render: (row) => `${row.nombres} ${row.apellidoPaterno} ${row.apellidoMaterno}`.trim(),
    },
    { accessor: 'nroDocumento', title: 'Nro. Documento', sortable: true },
    { accessor: 'descripcionTipoDocumento', title: 'Tipo Doc.', sortable: true },
    { accessor: 'descripcionPais', title: 'País', sortable: true },
    { accessor: 'generoTexto', title: 'Género', sortable: true },
    {
      accessor: 'estado',
      title: 'Estado',
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.estado === 'Aprehendido'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {row.estado}
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
          {row.urlFotoFrente && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm !p-1.5"
              onClick={() => window.open(row.urlFotoFrente, '_blank')}
              title="Ver foto frente"
            >
              <IconEye className="h-4 w-4" />
            </button>
          )}
          {row.urlFotoDocumento && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm !p-1.5"
              onClick={() => window.open(row.urlFotoDocumento, '_blank')}
              title="Ver foto documento"
            >
              <IconGallery className="h-4 w-4" />
            </button>
          )}
          {row.urlFotoPerfilIzquierdo && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm !p-1.5"
              onClick={() => window.open(row.urlFotoPerfilIzquierdo, '_blank')}
              title="Ver foto perfil izquierdo"
            >
              <IconEye className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <VristoDataTable<PersonaSiiiRow>
      title="Personas SIII"
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