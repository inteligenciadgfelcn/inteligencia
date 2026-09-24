'use client';

import { useState } from 'react';
import type {
  BienDetalleAvanzado,
  ResultadoBusquedaAvanzada,
} from '../types/siii.types';

interface Props {
  caso: ResultadoBusquedaAvanzada;
  onBack: () => void;
}

type TabKey = 'personas' | 'bienes';

interface PersonaImplicada {
  nombre: string;
  doc?: string;
  nac?: string;
  estado?: string;
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'personas', label: 'Personas' },
  { key: 'bienes', label: 'Bienes / Secuestros' },
];

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
  if (e.includes('aprehendido')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  if (e.includes('arrestado')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
  if (e.includes('principal')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
};

const formatearCosto = (valor: number) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  }).format(valor);

function Campo({ label, valor }: { label: string; valor: string | number | null }) {
  return (
    <div>
      <span className="block text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <p className="font-medium text-gray-900 dark:text-white">{valor || '-'}</p>
    </div>
  );
}

function PersonasView({ personasImplicadas }: { personasImplicadas: string }) {
  const personas = parsePersonas(personasImplicadas);

  if (!personas.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Sin personas registradas en este operativo.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {personas.map((persona, i) => (
        <div
          key={i}
          className="rounded-md border border-[#e0e6ed] bg-white p-4 dark:border-[#1b2e4b] dark:bg-[#0f172a]"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-900 dark:text-white">
              {persona.nombre}
            </p>
            {persona.estado && (
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoVariant(persona.estado)}`}
              >
                {persona.estado}
              </span>
            )}
          </div>
          {(persona.doc || persona.nac) && (
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {persona.doc && <p>Doc.: {persona.doc}</p>}
              {persona.nac && <p>Nac.: {persona.nac}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BienesView({ detalleBienes }: { detalleBienes: BienDetalleAvanzado[] }) {
  if (!detalleBienes.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Sin bienes registrados en este operativo.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {detalleBienes.map((bien) => (
        <div
          key={bien.idItemBienSecuestrado}
          className="rounded-md border border-[#e0e6ed] bg-white p-4 dark:border-[#1b2e4b] dark:bg-[#0f172a]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {bien.tipoBien}
              </p>
              {bien.caracteristicas.length > 0 && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {bien.caracteristicas.map((c) => c.descripcion).join(', ')}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {bien.esSecuestrado && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Secuestrado
                </span>
              )}
              {bien.esIncautado && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  Incautado
                </span>
              )}
              {bien.esConfiscado && (
                <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900/30 dark:text-pink-400">
                  Confiscado
                </span>
              )}
              {bien.enInvestigacion && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  En investigación
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-[#e0e6ed] pt-3 text-sm dark:border-[#1b2e4b] sm:grid-cols-3">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Cantidad</span>
              <p className="font-medium">{bien.cantidad}</p>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Costo aproximado</span>
              <p className="font-medium">{formatearCosto(bien.costoAproximado)}</p>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Costo cuantificado</span>
              <p className="font-medium">{formatearCosto(bien.costoCuantificado)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetalleCasoSiii({ caso, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('personas');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onBack}
        >
          ‹ Volver a resultados
        </button>
        <div className="flex flex-wrap items-center gap-1.5">
          {caso.esAprehendido && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Aprehendido
            </span>
          )}
          {caso.esArrestado && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              Arrestado
            </span>
          )}
          {caso.esPositivo && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Positivo
            </span>
          )}
          {caso.esIcia && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              ICIA
            </span>
          )}
          {caso.esParteDiario && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Parte diario
            </span>
          )}
          {caso.esRevisado && (
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
              Revisado
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-md border border-[#e0e6ed] bg-gray-50 p-4 dark:border-[#1b2e4b] dark:bg-gray-800/30">
        <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Campo label="Caso Nro" valor={caso.numeroCaso} />
          <Campo label="Nombre del caso" valor={caso.nombreCaso} />
          <Campo label="Fecha operativo" valor={caso.fechaOperativo} />
          <Campo label="Nro operativo" valor={caso.numeroOperativo} />
          <Campo label="Nro informe" valor={caso.numeroInforme} />
          <Campo label="IANUS" valor={caso.ianus} />
          <Campo label="Tipo operativo" valor={caso.tipoOperativo} />
          <Campo
            label="Relevancia"
            valor={caso.tipoRelevancia}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 border-t border-[#e0e6ed] pt-3 sm:grid-cols-2 dark:border-[#1b2e4b]">
          <Campo label="Ubicación institucional" valor={caso.ubicacionInstitucional} />
          <Campo label="Ubicación geográfica" valor={caso.ubicacionGeografica} />
          <Campo label="Categoría" valor={caso.categoriaOperativo} />
          <Campo label="Plan de operación" valor={caso.planOperacion} />
          <Campo label="Fiscal solicitud" valor={caso.fiscalSolicitud} />
          <Campo label="Asignado" valor={caso.asignado} />
          <Campo label="Asignado fiscal" valor={caso.asignadoFiscal} />
          <Campo label="Organización" valor={caso.organizacion} />
          <Campo label="Al mando de" valor={caso.alMandoDe} />
          <Campo label="Clan familiar" valor={caso.clanFamiliar} />
          <Campo label="Tipo denuncia" valor={caso.tipoDenuncia} />
          <Campo label="Tipo penal" valor={caso.tipoPenal} />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-[#e0e6ed] bg-white p-4 dark:border-[#1b2e4b] dark:bg-[#0f172a]">
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Costo total aproximado de bienes
          </span>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatearCosto(caso.costoTotalAproximadoBienes)}
          </p>
        </div>
        <div className="rounded-md border border-[#e0e6ed] bg-white p-4 dark:border-[#1b2e4b] dark:bg-[#0f172a]">
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Costo total cuantificado de bienes
          </span>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatearCosto(caso.costoTotalCuantificadoBienes)}
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
          <PersonasView personasImplicadas={caso.personasImplicadas} />
        )}
        {activeTab === 'bienes' && (
          <BienesView detalleBienes={caso.detalleBienes} />
        )}
      </div>
    </div>
  );
}