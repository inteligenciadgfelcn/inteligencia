'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { VristoDataTable, type Column } from '@/components/datatable/VristoDataTable';
import { Button } from '@/components/ui/Button';
import { AlertDialog } from '@/components/modales/AlertDialog';
import IconLink from '@/components/Icon/IconLink';
import IconTrash from '@/components/Icon/IconTrash';
import { SiiiApi } from '../../api/siii-apd.api';
import { PresedenciaApi, PresedenciaCasoRow } from '../../../inicio_investigacion/api/presedencia.api';
import type {
  BienDetalleAvanzado,
  ConsultaSiiiQueryDto,
  ResultadoBusquedaAvanzada,
} from '../../types/siii-apd.types';

interface Props {
  casoId?: number | null;
  isLectura?: boolean;
}

interface PersonaImplicada {
  nombre: string;
  doc?: string;
  nac?: string;
  estado?: string;
}

const formatearCosto = (valor: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  }).format(valor);

const parsePersonas = (personasImplicadas: string): PersonaImplicada[] => {
  if (!personasImplicadas) return [];
  return personasImplicadas.split(' | ').map((bloque) => {
    const lineas = bloque
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const extraer = (prefijo: string) =>
      lineas.find((l) => l.startsWith(prefijo))?.replace(prefijo, '').trim();
    return {
      nombre: lineas[0] ?? '',
      doc: extraer('Doc.:'),
      nac: extraer('Nac.:'),
      estado: extraer('Estado:'),
    };
  });
};

const estadoVariant = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes('aprehendido'))
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (e.includes('arrestado'))
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  if (e.includes('principal'))
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
};

const separarFechaHora = (valor: string): { fecha: string; hora?: string } => {
  if (!valor) return { fecha: '-', hora: undefined };
  const partes = valor.trim().split(/\s+/);
  return { fecha: partes[0], hora: partes[1] };
};

const bienEstados = (
  bien: BienDetalleAvanzado
): Array<{ label: string; className: string }> => {
  const estados: Array<{ label: string; className: string }> = [];
  if (bien.esSecuestrado)
    estados.push({
      label: 'Secuestrado',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    });
  if (bien.esIncautado)
    estados.push({
      label: 'Incautado',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    });
  if (bien.esConfiscado)
    estados.push({
      label: 'Confiscado',
      className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    });
  if (bien.enInvestigacion)
    estados.push({
      label: 'En investigación',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    });
  return estados;
};

function BienesExpansion({ detalleBienes }: { detalleBienes: BienDetalleAvanzado[] }) {
  if (!detalleBienes.length) {
    return (
      <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Sin bienes registrados en este operativo.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="w-full table-hover whitespace-nowrap">
        <thead>
          <tr className="border-b border-[#e0e6ed] dark:border-gray-700">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Bien
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Cantidad
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Características
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Total aproximado
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Total cuantificado
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
              Estado jurídico
            </th>
          </tr>
        </thead>
        <tbody>
          {detalleBienes.map((bien) => {
            const caracteristicas = bien.caracteristicas
              .map((c) => c.descripcion)
              .join(', ');
            return (
              <tr
                key={bien.idItemBienSecuestrado}
                className="border-b border-[#e0e6ed] dark:border-gray-800"
              >
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {bien.tipoBien}
                  </p>
                </td>
                <td className="px-3 py-2 text-sm">{bien.cantidad}</td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {caracteristicas || '-'}
                </td>
                <td className="px-3 py-2 text-sm">{formatearCosto(bien.costoAproximado)}</td>
                <td className="px-3 py-2 text-sm">
                  {formatearCosto(bien.costoCuantificado)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bienEstados(bien).map((estado) => (
                      <span
                        key={estado.label}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estado.className}`}
                      >
                        {estado.label}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type Confirmacion =
  | { tipo: 'relacionar'; row: ResultadoBusquedaAvanzada }
  | { tipo: 'inactivar'; row: ResultadoBusquedaAvanzada; preseId: string }
  | null;

interface Mensaje {
  tipo: 'success' | 'error';
  texto: string;
}

const mensajeDeError = (err: unknown): string => {
  if (err && typeof err === 'object' && 'mensaje' in err) {
    return String((err as { mensaje: unknown }).mensaje);
  }
  if (typeof err === 'string' && err) return err;
  return 'Ocurrió un error inesperado';
};

export function CasosRelacionados({ casoId, isLectura = false }: Props) {

  const queryClient = useQueryClient();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [confirmacion, setConfirmacion] = useState<Confirmacion>(null);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  // const { data: filas, isLoading, isError } = useQuery({
  //   queryKey: ['siii-avanzado', filtro],
  //   queryFn: () => SiiiApi.buscarAvanzado(filtro),
  // });

  const { data: respCasos, isLoading, isError, refetch } = useQuery({
    queryKey: ['lgi-registro-caso', 'presedencias', casoId],
    enabled: Boolean(casoId),
    queryFn: () =>
      PresedenciaApi.listarPorCaso(casoId!, { pagina: 1, limite: 50 }),
  });

  const presedencias: PresedenciaCasoRow[] = respCasos?.filas ?? [];
  const presedenciasSet = new Set(
    presedencias.map((p) => p.nrocasopre.trim().toUpperCase())
  );
  const filas: ResultadoBusquedaAvanzada[] = presedencias.flatMap((p) => p.operativosSiii ?? []);

  // const invalidarPresedencias = () =>
  //   queryClient.invalidateQueries({
  //     queryKey: ['lgi-registro-caso', 'presedencias', casoId],
  //   });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleConfirmar = async () => {
    if (!confirmacion) return;
    setProcesando(true);
    setMensaje(null);
    try {
      if (confirmacion.tipo === 'relacionar') {
        await PresedenciaApi.registrar(casoId!, confirmacion.row.numeroCaso);
        setMensaje({
          tipo: 'success',
          texto: `Caso ${confirmacion.row.numeroCaso} vinculado como caso precedente.`,
        });
      } else {
        await PresedenciaApi.eliminar(confirmacion.preseId);
        setMensaje({
          tipo: 'success',
          texto: `Precedencia del caso ${confirmacion.row.numeroCaso} inactivada.`,
        });
      }
      // invalidarPresedencias();
      setConfirmacion(null);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) });
    } finally {
      setProcesando(false);
      refetch();
    }
  };

  const accionesColumna: Column<ResultadoBusquedaAvanzada>[] = isLectura
    ? []
    : ([
      {
        accessor: 'acciones',
        title: 'Acciones',
        render: (row) => {
          const relacionado = true;
          if (!casoId) {
            return (
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                className="!p-1.5"
                disabled
                title="Registre primero los datos generales"
              >
                <IconLink className="h-4 w-4" />
              </Button>
            );
          }
          return relacionado ? (
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              className="!p-1.5"
              title="Inactivar precedencia"
              onClick={() => {
                const presedencia = presedencias.find(
                  (p) =>
                    p.nrocasopre.trim().toUpperCase() ===
                    row.numeroCaso?.trim().toUpperCase()
                );
                setConfirmacion({
                  tipo: 'inactivar',
                  row,
                  preseId: presedencia?.preseId ?? '',
                });
              }}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline-primary"
              size="sm"
              className="!p-1.5"
              title="Relacionar como caso precedente"
              onClick={() => setConfirmacion({ tipo: 'relacionar', row })}
            >
              <IconLink className="h-4 w-4" />
            </Button>
          );
        },
      },
    ] as Column<ResultadoBusquedaAvanzada>[]);

  const columns: Column<ResultadoBusquedaAvanzada>[] = [
    {
      accessor: 'operativo',
      title: 'Operativo',
      render: (row) => {
        const { fecha, hora } = separarFechaHora(row.fechaOperativo);
        return (
          <div className="whitespace-normal space-y-0.5 text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">
              {row.numeroCaso}
            </p>
            <p className="text-xs text-gray-500">Nro. operativo: {row.numeroOperativo}</p>
            <p className="text-xs text-gray-500">
              {fecha}
              {hora ? ` ${hora}` : ''}
            </p>
            <p className="text-xs text-gray-500">{row.ubicacionInstitucional}</p>
            <p className="text-xs text-gray-500">Asignado: {row.asignado}</p>
            <p className="text-xs text-gray-500">Fiscal: {row.asignadoFiscal}</p>
          </div>
        );
      },
    },
    {
      accessor: 'personas',
      title: 'Personas implicadas',
      render: (row) => {
        const personas = parsePersonas(row.personasImplicadas);
        if (!personas.length) return <span className="text-xs text-gray-400">-</span>;
        return (
          <div className="whitespace-normal space-y-2">
            {personas.map((persona, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {persona.nombre}
                  </p>
                  {persona.estado && (
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${estadoVariant(persona.estado)}`}
                    >
                      {persona.estado}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
                  {persona.doc && <span>Doc.: {persona.doc}</span>}
                  {persona.nac && <span>Nac.: {persona.nac}</span>}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessor: 'totalBienes',
      title: 'Nro total de bienes',
      className: 'cursor-pointer',
      render: (row) => (
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={() => toggleExpand(row.idOperativo)}
        >
          {row.detalleBienes.length}
        </button>
      ),
    },
    {
      accessor: 'costoTotalAproximadoBienes',
      title: 'Total aproximado',
      className: 'cursor-pointer',
      render: (row) => (
        <button
          type="button"
          className="font-medium text-gray-900 hover:text-primary hover:underline dark:text-white"
          onClick={() => toggleExpand(row.idOperativo)}
        >
          {formatearCosto(row.costoTotalAproximadoBienes)}
        </button>
      ),
    },
    {
      accessor: 'costoTotalCuantificadoBienes',
      title: 'Total cuantificado',
      className: 'cursor-pointer',
      render: (row) => (
        <button
          type="button"
          className="font-medium text-gray-900 hover:text-primary hover:underline dark:text-white"
          onClick={() => toggleExpand(row.idOperativo)}
        >
          {formatearCosto(row.costoTotalCuantificadoBienes)}
        </button>
      ),
    },
    ...accionesColumna,
  ];

  return (
    <div className="space-y-3">
      {isError && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          Ocurrió un error al consultar los antecedentes SIII.
        </div>
      )}
      {mensaje && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${mensaje.tipo === 'success'
            ? 'border-success/30 bg-success/5 text-success'
            : 'border-danger/30 bg-danger/5 text-danger'
            }`}
        >
          {mensaje.texto}
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
        columns={columns}
        loading={isLoading}
        rowExpansion={{
          idField: 'idOperativo',
          expandedIds,
          onExpandChange: (ids) => setExpandedIds(ids as string[]),
          renderContent: (row) => (
            <BienesExpansion detalleBienes={row.detalleBienes} />
          ),
        }}
      />

      <AlertDialog
        isOpen={confirmacion !== null}
        titulo={
          confirmacion?.tipo === 'inactivar'
            ? 'Inactivar precedencia'
            : 'Relacionar caso precedente'
        }
        texto={
          confirmacion
            ? confirmacion.tipo === 'inactivar'
              ? `¿Desea inactivar la precedencia del caso "${confirmacion.row.numeroCaso}" de este caso?`
              : `¿Desea vincular el caso "${confirmacion.row.numeroCaso}" como caso precedente de este caso?`
            : ''
        }
      >
        <Button
          type="button"
          variant="outline-secondary"
          disabled={procesando}
          onClick={() => setConfirmacion(null)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant={confirmacion?.tipo === 'inactivar' ? 'danger' : 'primary'}
          loading={procesando}
          onClick={handleConfirmar}
        >
          {confirmacion?.tipo === 'inactivar' ? 'Inactivar' : 'Relacionar'}
        </Button>
      </AlertDialog>
    </div>
  );
}