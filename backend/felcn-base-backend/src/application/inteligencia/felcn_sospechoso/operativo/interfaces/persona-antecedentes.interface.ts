export interface OperativoResumen {
  numero_operativo: string;
  nombre_caso: string;
  asignado_caso: string;
  telefono_asignado: string;
}

export interface PersonaAntecedente {
  nro_documento: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  cantidad_operativos: number;
  operativos: OperativoResumen[];
}