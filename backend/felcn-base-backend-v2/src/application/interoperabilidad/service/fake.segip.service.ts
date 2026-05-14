export interface Persona {
  NumeroDocumento: string;

  ComplementoVisible?: string;
  Complemento?: string;

  Fotografia?: string;

  Nombres: string;
  PrimerApellido: string;
  SegundoApellido: string;

  ProfesionOcupacion?: string;

  FechaNacimiento: string;

  LugarNacimientoPais: string;
  LugarExpedicion?: string;

  EstadoCivil?: string;
  NombreCompletoConyuge?: string;

  Domicilio?: string;

  Nacionalidad?: string;

  Genero: string;

  GrupoSanguineo?: string;

  LugarNacimientoDepartamento?: string;
  LugarNacimientoProvincia?: string;
  LugarNacimientoLocalidad?: string;

  NombreCompletoPadre?: string;
  NombreCompletoMadre?: string;

  TipoRegistro?: string;
}

export const fakeSegip: Persona[] = [
  {
    NumeroDocumento: "4269397",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "MIGUEL ALEJANDRO",
    PrimerApellido: "VASQUEZ",
    SegundoApellido: "MARTINEZ",
    ProfesionOcupacion: "ABOGADO",
    FechaNacimiento: "1981-09-16",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "LP",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "VERONICA ADRIANA CALDERON JUSTINIANO",
    Domicilio: "CALLE 5 # 1000 Z. ALTO GRAMADAL",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "ORH+",
    LugarNacimientoDepartamento: "LA PAZ",
    LugarNacimientoProvincia: "MURILLO",
    LugarNacimientoLocalidad: "NUESTRA SENORA DE LA PAZ",
    NombreCompletoPadre: "MIGUEL HUMBERTO VASQUEZ VISCARRA",
    NombreCompletoMadre: "GUADALUPE MARTINEZ GUERRA",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "3555411",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "OSCAR GONZALO",
    PrimerApellido: "PACO",
    SegundoApellido: "VASQUEZ",
    ProfesionOcupacion: "ING. DE SISTEMAS",
    FechaNacimiento: "1981-05-05",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "OR",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "SILVIA VELASCO HINOJOSA",
    Domicilio: "AV 14 DE SEPTIEMBRE ENTRE C/9 Y 10 N 5539 - LA PAZ",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "O+",
    LugarNacimientoDepartamento: "ORURO",
    LugarNacimientoProvincia: "CERCADO",
    LugarNacimientoLocalidad: "ORURO",
    NombreCompletoPadre: "EMILIO PACO ROMERO",
    NombreCompletoMadre: "ALICIA VASQUEZ MARCA",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "3454138",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "CARLA ANDREA",
    PrimerApellido: "LANZA",
    SegundoApellido: "TORREZ",
    ProfesionOcupacion: "ESTUDIANTE",
    FechaNacimiento: "1985-10-01",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "LP",
    EstadoCivil: "SOLTERA",
    NombreCompletoConyuge: "LAURA MENDEZ",
    Domicilio: "C. 48 No 6 Z. CHASQUIPAMPA",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "B+",
    LugarNacimientoDepartamento: "LA PAZ",
    LugarNacimientoProvincia: "MURILLO",
    LugarNacimientoLocalidad: "NUESTRA SENORA DE LA PAZ",
    NombreCompletoPadre: "AGUSTIN REYNALDO LANZA VALLE",
    NombreCompletoMadre: "JULIETA TORREZ JAUREGUI",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "3461235",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "JUAN CARLOS",
    PrimerApellido: "QUISPE",
    SegundoApellido: "HINOJOSA",
    ProfesionOcupacion: "LIC. EN INFORMATICA",
    FechaNacimiento: "1976-02-21",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "LP",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "LUCIA MARGOT CHIRINOS FLORES",
    Domicilio: "C.1 MANZANO D Z. 8 DE DICIEMBRE",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "ORH+",
    LugarNacimientoDepartamento: "LA PAZ",
    LugarNacimientoProvincia: "MURILLO",
    LugarNacimientoLocalidad: "NUESTRA SENORA DE LA PAZ",
    NombreCompletoPadre: "MELITON QUISPE CHOQUE",
    NombreCompletoMadre: "FELIZA HINOJOSE MARQUEZ",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "9234512",
    ComplementoVisible: "1",
    Complemento: "2B",
    Nombres: "RODRIGO ALEJANDRO",
    PrimerApellido: "SALAZAR",
    SegundoApellido: "ORTEGA",
    ProfesionOcupacion: "CONTADOR",
    FechaNacimiento: "1980-09-30",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "OR",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "PATRICIA VEGA",
    Domicilio: "ZONA NORTE",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "O-",
    LugarNacimientoDepartamento: "ORURO",
    LugarNacimientoProvincia: "CERCADO",
    LugarNacimientoLocalidad: "ORURO",
    NombreCompletoPadre: "ALBERTO SALAZAR",
    NombreCompletoMadre: "NORA ORTEGA",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "7312456",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "VERONICA",
    PrimerApellido: "HERRERA",
    SegundoApellido: "MENDOZA",
    ProfesionOcupacion: "ENFERMERA",
    FechaNacimiento: "1991-02-11",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "PT",
    EstadoCivil: "SOLTERO",
    NombreCompletoConyuge: "",
    Domicilio: "VILLA IMPERIAL",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "A-",
    LugarNacimientoDepartamento: "POTOSI",
    LugarNacimientoProvincia: "TOMAS FRIAS",
    LugarNacimientoLocalidad: "POTOSI",
    NombreCompletoPadre: "JULIO HERRERA",
    NombreCompletoMadre: "ROSA MENDOZA",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "6123457",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "JAVIER EDUARDO",
    PrimerApellido: "TORREZ",
    SegundoApellido: "MORALES",
    ProfesionOcupacion: "DOCENTE",
    FechaNacimiento: "1979-12-01",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "BN",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "LILIANA PAREDES",
    Domicilio: "TRINIDAD CENTRO",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "B-",
    LugarNacimientoDepartamento: "BENI",
    LugarNacimientoProvincia: "CERCADO",
    LugarNacimientoLocalidad: "TRINIDAD",
    NombreCompletoPadre: "RICARDO TORREZ",
    NombreCompletoMadre: "GLADYS MORALES",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "4785123",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "DIEGO MARTIN",
    PrimerApellido: "NAVARRO",
    SegundoApellido: "SOTO",
    ProfesionOcupacion: "PROGRAMADOR",
    FechaNacimiento: "1998-10-19",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "LP",
    EstadoCivil: "SOLTERO",
    NombreCompletoConyuge: "",
    Domicilio: "ACHUMANI",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "AB-",
    LugarNacimientoDepartamento: "LA PAZ",
    LugarNacimientoProvincia: "MURILLO",
    LugarNacimientoLocalidad: "EL ALTO",
    NombreCompletoPadre: "RAUL NAVARRO",
    NombreCompletoMadre: "MIRIAM SOTO",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "9547812",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "SANDRA LUZ",
    PrimerApellido: "PAREDES",
    SegundoApellido: "ALMANZA",
    ProfesionOcupacion: "ADMINISTRADORA",
    FechaNacimiento: "1987-04-04",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "SC",
    EstadoCivil: "VIUDO",
    NombreCompletoConyuge: "OSCAR RIVERA",
    Domicilio: "EQUIPETROL",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "A+",
    LugarNacimientoDepartamento: "SANTA CRUZ",
    LugarNacimientoProvincia: "ANDRES IBAÑEZ",
    LugarNacimientoLocalidad: "MONTERO",
    NombreCompletoPadre: "MARIO PAREDES",
    NombreCompletoMadre: "LUISA ALMANZA",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "8123475",
    ComplementoVisible: "1",
    Complemento: "7F",
    Nombres: "KAREN SOLEDAD",
    PrimerApellido: "ESPINOZA",
    SegundoApellido: "MIRANDA",
    ProfesionOcupacion: "DISEÑADORA GRAFICA",
    FechaNacimiento: "1999-11-27",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "TJ",
    EstadoCivil: "SOLTERO",
    NombreCompletoConyuge: "",
    Domicilio: "SAN MATEO",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "O-",
    LugarNacimientoDepartamento: "TARIJA",
    LugarNacimientoProvincia: "GRAN CHACO",
    LugarNacimientoLocalidad: "YACUIBA",
    NombreCompletoPadre: "SERGIO ESPINOZA",
    NombreCompletoMadre: "LIDIA MIRANDA",
    TipoRegistro: "BIOMETRICO"
  }
];
