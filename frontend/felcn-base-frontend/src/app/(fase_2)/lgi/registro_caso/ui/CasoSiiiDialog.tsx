'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CustomDialog } from '@/components/modales/CustomDialog';
import { SiiiApi } from '../api/siii.api';
import type { CasoSiiiRow } from '../types/siii.types';
import { PersonasSiiiDataTable } from './PersonasSiiiDataTable';
import { BienesSiiiDataTable } from './BienesSiiiDataTable';
import IconXCircle from '@/components/Icon/IconXCircle';

interface Props {
  nroCaso: string;
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'personas' | 'bienes';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'personas', label: 'Personas' },
  { key: 'bienes', label: 'Bienes / Secuestros' },
];

export function CasoSiiiDialog({ nroCaso, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('personas');

  const { data: casoData, isLoading, isError, error } = useQuery({
    queryKey: ['siii-caso', nroCaso],
    enabled: Boolean(nroCaso && isOpen),
    queryFn: () => SiiiApi.obtenerCaso(nroCaso),
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      handleClose={onClose}
      title={`Caso: ${casoData?.numero_caso ?? nroCaso}`}
      // fullScreen={true}
      paperProps={{ style: { maxWidth: '50%', width: '50%' } }}
      maxWidth="xl"
    >
      {isLoading && !casoData ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse space-y-4 w-full max-w-md px-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-600 dark:text-red-400">
          <IconXCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-medium">No se encontró el caso</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {error instanceof Error ? error.message : 'Error al cargar el caso'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Número de caso: {nroCaso}
          </p>
        </div>
      ) : casoData ? (
        <>
          <div className="p-4 border-b bg-gray-50 dark:bg-gray-800/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Caso Nro</span>
                <p className="font-medium text-gray-900 dark:text-white">{casoData.numero_caso}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">CUD</span>
                <p className="font-medium text-gray-900 dark:text-white">{casoData.codigo_servicio}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Fecha</span>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(casoData.fecha_hora_ingreso)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">Unidad</span>
                <p className="font-medium text-gray-900 dark:text-white">{casoData.unidad}</p>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Lugar</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {casoData.distrito} - {casoData.grupo}
              </p>
            </div>
          </div>

          <div className="border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
            <div className="flex flex-wrap">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
                      active
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'personas' && (
              <PersonasSiiiDataTable idOperativo={casoData.idOperativo} />
            )}
            {activeTab === 'bienes' && (
              <BienesSiiiDataTable idOperativo={casoData.idOperativo} />
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Seleccione un caso para ver los detalles
        </div>
      )}
    </CustomDialog>
  );
}