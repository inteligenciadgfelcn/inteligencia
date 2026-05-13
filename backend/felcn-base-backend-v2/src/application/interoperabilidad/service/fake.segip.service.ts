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
    NumeroDocumento: "6845123",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "LUIS FERNANDO",
    PrimerApellido: "MAMANI",
    SegundoApellido: "QUISPE",
    ProfesionOcupacion: "ABOGADO",
    FechaNacimiento: "1988-03-14",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "LP",
    EstadoCivil: "CASADO",
    NombreCompletoConyuge: "MARIA ELENA CHOQUE",
    Domicilio: "ZONA MIRAFLORES",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "A+",
    LugarNacimientoDepartamento: "LA PAZ",
    LugarNacimientoProvincia: "MURILLO",
    LugarNacimientoLocalidad: "LA PAZ",
    NombreCompletoPadre: "ROBERTO MAMANI",
    NombreCompletoMadre: "JUANA QUISPE",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "7934215",
    ComplementoVisible: "1",
    Complemento: "1A",
    Nombres: "CARLA ANDREA",
    PrimerApellido: "ROJAS",
    SegundoApellido: "VARGAS",
    ProfesionOcupacion: "MEDICO",
    FechaNacimiento: "1992-07-09",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "CB",
    EstadoCivil: "SOLTERO",
    NombreCompletoConyuge: "",
    Domicilio: "QUILLACOLLO",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "O+",
    LugarNacimientoDepartamento: "COCHABAMBA",
    LugarNacimientoProvincia: "QUILLACOLLO",
    LugarNacimientoLocalidad: "QUILLACOLLO",
    NombreCompletoPadre: "JORGE ROJAS",
    NombreCompletoMadre: "MARTA VARGAS",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "5123498",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "MIGUEL ANGEL",
    PrimerApellido: "SUAREZ",
    SegundoApellido: "LOPEZ",
    ProfesionOcupacion: "INGENIERO CIVIL",
    FechaNacimiento: "1985-11-22",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "SC",
    EstadoCivil: "DIVORCIADO",
    NombreCompletoConyuge: "LAURA MENDEZ",
    Domicilio: "PLAN 3000",
    Nacionalidad: "BOLIVIANA",
    Genero: "MASCULINO",
    GrupoSanguineo: "B+",
    LugarNacimientoDepartamento: "SANTA CRUZ",
    LugarNacimientoProvincia: "ANDRES IBAÑEZ",
    LugarNacimientoLocalidad: "SANTA CRUZ",
    NombreCompletoPadre: "PEDRO SUAREZ",
    NombreCompletoMadre: "LUCIA LOPEZ",
    TipoRegistro: "BIOMETRICO"
  },

  {
    NumeroDocumento: "8456123",
    ComplementoVisible: "0",
    Complemento: "",
    Nombres: "ANA MARIA",
    PrimerApellido: "FLORES",
    SegundoApellido: "CASTILLO",
    ProfesionOcupacion: "ARQUITECTA",
    FechaNacimiento: "1995-05-17",
    LugarNacimientoPais: "BOLIVIA",
    LugarExpedicion: "TJ",
    EstadoCivil: "SOLTERO",
    NombreCompletoConyuge: "",
    Domicilio: "BARRIO SENAC",
    Nacionalidad: "BOLIVIANA",
    Genero: "FEMENINO",
    GrupoSanguineo: "AB+",
    LugarNacimientoDepartamento: "TARIJA",
    LugarNacimientoProvincia: "CERCADO",
    LugarNacimientoLocalidad: "TARIJA",
    NombreCompletoPadre: "JUAN FLORES",
    NombreCompletoMadre: "ELSA CASTILLO",
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