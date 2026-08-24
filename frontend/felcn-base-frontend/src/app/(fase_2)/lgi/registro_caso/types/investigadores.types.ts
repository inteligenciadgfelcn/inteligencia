export interface InvestigadorCasoRow {
  investigadorId: string;
  casoId: string;
  numeroPase: string;
  memo: string;
  fechaAsignacion: string;
  actual: boolean;
  informacionActualizada: string;
  fechaHoraIngreso: string;
  usuario: string;
  estadoInvestigador: 'ASIGNADO' | 'SEPARADO' | 'REASIGNADO';
  fechaSeparacion: string;
  usuarioActualizacion: string | null;
  fechaActualizacion: string | null;
}

export interface InvestigadoresCasoResponse {
  casoId: number;
  total: number;
  investigadores: InvestigadorCasoRow[];
}

export interface InvestigadorGeneralRow {
  numeroPase: string;
  investigador: string;
  usuarioId: string;
  gradoId: number;
  grupoId: number;
  estado: string;
}

export interface InvestigadoresGeneralResponse {
  finalizado: boolean;
  mensaje: string;
  datos: {
    total: number;
    filas: InvestigadorGeneralRow[];
  };
}

export type EstadoInvestigador = 'ASIGNADO' | 'SEPARADO' | 'REASIGNADO';

export interface InvestigadorFormValues {
  filtroBusqueda: string;
  estado: string;
  numeroPase: string;
  memo: string;
  fechaAsignacion: string;
  fechaSeparacion: string;
  selectedInvestigador: InvestigadorGeneralRow | null;
}

export interface AsignarInvestigadorPayload {
  numeroPase: string;
  memo: string;
  fechaAsignacion: string;
}

export interface SepararInvestigadorPayload {
  fechaSeparacion: string;
}
