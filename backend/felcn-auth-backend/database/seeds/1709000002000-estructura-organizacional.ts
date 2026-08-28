import { Distrital } from '@/core/estructura/entity/distrital.entity'
import { Grupo } from '@/core/estructura/entity/grupo.entity'
import { Unidad } from '@/core/estructura/entity/unidad.entity'
import { USUARIO_SISTEMA } from '@/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Seed: Estructura organizacional FELCN (Unidad -> Distrital -> Grupo).
 * Datos tomados tal cual de parametro.unidad / parametro.distrital /
 * parametro.grupo (BD felcn_auth_v3). Se conservan los ids de origen para
 * respetar las claves foráneas idUnidad / idDistrital.
 */
export class estructuraOrganizacional1709000002000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA_PARAMETRO
    const auditoria = {
      estado: 'ACTIVO',
      transaccion: 'SEEDS',
      usuarioCreacion: USUARIO_SISTEMA,
    }

    const unidadesData: {
      id: number
      abreviatura: string
      descripcion: string
      esOperativaAdmin: boolean
    }[] = [
      {
        id: 1,
        abreviatura: 'UM',
        descripcion: 'Unidad Movil de Patrullaje Rural',
        esOperativaAdmin: true,
      },
      {
        id: 2,
        abreviatura: 'OE',
        descripcion: 'Grupo de Inteligencia de Operaciones Especiales',
        esOperativaAdmin: true,
      },
      {
        id: 3,
        abreviatura: 'QU',
        descripcion: 'Grupo de Investigacion de Sustancias Quimicas',
        esOperativaAdmin: true,
      },
      {
        id: 4,
        abreviatura: 'EF',
        descripcion: 'Grupo de Investigacion Economicos Financieros',
        esOperativaAdmin: true,
      },
      {
        id: 5,
        abreviatura: 'CE',
        descripcion: 'Grupo de Investigacion de Casos Especiales',
        esOperativaAdmin: true,
      },
      {
        id: 6,
        abreviatura: 'JA',
        descripcion: 'Grupo Especial de Control de Aeropuertos',
        esOperativaAdmin: true,
      },
      {
        id: 7,
        abreviatura: 'CC',
        descripcion: 'Grupo Especial de Control de Coca',
        esOperativaAdmin: true,
      },
      {
        id: 8,
        abreviatura: 'JLP',
        descripcion: 'Dirección Departamental La Paz',
        esOperativaAdmin: true,
      },
      {
        id: 9,
        abreviatura: 'JOR',
        descripcion: 'Dirección Departamental Oruro',
        esOperativaAdmin: true,
      },
      {
        id: 10,
        abreviatura: 'JPT',
        descripcion: 'Dirección Departamental Potosi',
        esOperativaAdmin: true,
      },
      {
        id: 11,
        abreviatura: 'JCB',
        descripcion: 'Dirección Departamental Cochabamba',
        esOperativaAdmin: true,
      },
      {
        id: 12,
        abreviatura: 'JSC',
        descripcion: 'Dirección Departamental Santa Cruz',
        esOperativaAdmin: true,
      },
      {
        id: 13,
        abreviatura: 'JTJ',
        descripcion: 'Dirección Departamental Tarija',
        esOperativaAdmin: true,
      },
      {
        id: 14,
        abreviatura: 'JCH',
        descripcion: 'Dirección Departamental Chuquisaca',
        esOperativaAdmin: true,
      },
      {
        id: 15,
        abreviatura: 'JBN',
        descripcion: 'Dirección Departamental Beni',
        esOperativaAdmin: true,
      },
      {
        id: 16,
        abreviatura: 'JPN',
        descripcion: 'Dirección Departamental Pando',
        esOperativaAdmin: true,
      },
      {
        id: 17,
        abreviatura: 'DG-FELCN',
        descripcion:
          'Dirección General de la Fuerza Especial de Lucha Contra el Narcotráfico',
        esOperativaAdmin: false,
      },
      {
        id: 18,
        abreviatura: 'INSPEC',
        descripcion: 'Inspectoría General',
        esOperativaAdmin: false,
      },
      {
        id: 19,
        abreviatura: 'AJ',
        descripcion: 'Asesoría Jurídica',
        esOperativaAdmin: false,
      },
      {
        id: 20,
        abreviatura: 'SDEM',
        descripcion: 'Sub Dirección y Jefatura de Estado Mayor',
        esOperativaAdmin: false,
      },
      {
        id: 21,
        abreviatura: 'DNP',
        descripcion: 'Departamento Nacional de Personal',
        esOperativaAdmin: false,
      },
      {
        id: 22,
        abreviatura: 'DNI',
        descripcion: 'Departamento Nacional de Inteligencia',
        esOperativaAdmin: false,
      },
      {
        id: 23,
        abreviatura: 'DNPO',
        descripcion: 'Departamento Nacional de Planeamiento y Operaciones',
        esOperativaAdmin: false,
      },
      {
        id: 24,
        abreviatura: 'DNA',
        descripcion: 'Departamento Nacional Administrativo',
        esOperativaAdmin: false,
      },
      {
        id: 25,
        abreviatura: 'DNCSRI',
        descripcion:
          'Departamento Nacional de Comunicación Social y Relaciones Internacionales',
        esOperativaAdmin: false,
      },
      {
        id: 26,
        abreviatura: 'DNCITESC',
        descripcion:
          'Departamento Nacional del Centro de Investigación Técnico Científico en Toxicología Y Sustancias Controladas',
        esOperativaAdmin: false,
      },
    ]

    const distritalesData: {
      id: number
      idUnidad: number
      descripcion: string
    }[] = [
      { id: 1, idUnidad: 7, descripcion: 'Occidente' },
      { id: 2, idUnidad: 7, descripcion: 'Valle' },
      { id: 3, idUnidad: 7, descripcion: 'Oriente' },
      { id: 4, idUnidad: 1, descripcion: 'Yungas' },
      { id: 5, idUnidad: 1, descripcion: 'Chapare' },
      { id: 6, idUnidad: 1, descripcion: 'Oriente' },
      { id: 7, idUnidad: 1, descripcion: 'Beni' },
      { id: 8, idUnidad: 2, descripcion: 'Occidente' },
      { id: 9, idUnidad: 2, descripcion: 'Valle' },
      { id: 10, idUnidad: 2, descripcion: 'Oriente' },
      { id: 11, idUnidad: 3, descripcion: 'Occidente' },
      { id: 12, idUnidad: 3, descripcion: 'Valle' },
      { id: 13, idUnidad: 4, descripcion: 'Occidente' },
      { id: 14, idUnidad: 4, descripcion: 'Valle' },
      { id: 15, idUnidad: 4, descripcion: 'Oriente' },
      { id: 16, idUnidad: 5, descripcion: 'Occidente' },
      { id: 17, idUnidad: 5, descripcion: 'Valle' },
      { id: 18, idUnidad: 5, descripcion: 'Oriente' },
      { id: 19, idUnidad: 8, descripcion: 'La Paz' },
      { id: 20, idUnidad: 9, descripcion: 'Oruro' },
      { id: 21, idUnidad: 10, descripcion: 'Potosi' },
      { id: 22, idUnidad: 11, descripcion: 'Cochabamba' },
      { id: 23, idUnidad: 12, descripcion: 'Santa Cruz' },
      { id: 24, idUnidad: 13, descripcion: 'Tarija' },
      { id: 25, idUnidad: 14, descripcion: 'Chuquisaca' },
      { id: 26, idUnidad: 3, descripcion: 'Oriente' },
      { id: 27, idUnidad: 1, descripcion: 'Sur' },
      { id: 28, idUnidad: 2, descripcion: 'Amazonia' },
      { id: 29, idUnidad: 6, descripcion: 'Aeropuerto el Alto' },
      { id: 30, idUnidad: 6, descripcion: 'Aeropuerto Jorge Wilsterman' },
      { id: 31, idUnidad: 6, descripcion: 'Aeropuerto Viru Viru' },
      { id: 32, idUnidad: 6, descripcion: 'Aeropuerto Tarija' },
      { id: 33, idUnidad: 15, descripcion: 'Beni' },
      { id: 34, idUnidad: 16, descripcion: 'Pando' },
      { id: 35, idUnidad: 1, descripcion: 'Valle' },
      { id: 36, idUnidad: 1, descripcion: 'Pando' },
      { id: 37, idUnidad: 17, descripcion: 'Secretaria General' },
      {
        id: 38,
        idUnidad: 18,
        descripcion: 'Departamento Nacional de Poligrafía',
      },
      { id: 39, idUnidad: 19, descripcion: 'Secretaria' },
      { id: 40, idUnidad: 19, descripcion: 'Tracto Administrativo' },
      { id: 41, idUnidad: 19, descripcion: 'Archivos' },
      { id: 42, idUnidad: 19, descripcion: 'División Gestión Jurídica' },
      { id: 43, idUnidad: 19, descripcion: 'División Análisis Legal' },
      { id: 44, idUnidad: 20, descripcion: 'Sub Dirección' },
      { id: 45, idUnidad: 21, descripcion: 'Secretaría' },
      { id: 46, idUnidad: 21, descripcion: 'División Movimiento de Personal' },
      {
        id: 47,
        idUnidad: 21,
        descripcion: 'División Capacitación y Evaluación',
      },
      { id: 48, idUnidad: 21, descripcion: 'División Registro' },
      { id: 49, idUnidad: 21, descripcion: 'División Bienestar Social' },
      { id: 50, idUnidad: 22, descripcion: 'Secretaría' },
      { id: 51, idUnidad: 22, descripcion: 'División Información Antidrogas' },
      {
        id: 52,
        idUnidad: 22,
        descripcion: 'División Técnicas Especiales de Investigación',
      },
      { id: 53, idUnidad: 22, descripcion: 'División Tecnología y Telemática' },
      { id: 54, idUnidad: 22, descripcion: 'División Análisis Antidrogas' },
      {
        id: 55,
        idUnidad: 22,
        descripcion:
          'División del Grupo Especial de Intervención de Telecomunicaciones',
      },
      { id: 56, idUnidad: 23, descripcion: 'Secretaría' },
      { id: 57, idUnidad: 23, descripcion: 'División Planificación' },
      { id: 58, idUnidad: 23, descripcion: 'División Operaciones' },
      { id: 59, idUnidad: 23, descripcion: 'División Registro y Estadística' },
      { id: 60, idUnidad: 24, descripcion: 'Secretaría' },
      { id: 61, idUnidad: 24, descripcion: 'División Financiera' },
      {
        id: 62,
        idUnidad: 24,
        descripcion: 'División Abastecimiento y Armamento',
      },
      { id: 63, idUnidad: 24, descripcion: 'División Bienes' },
      { id: 64, idUnidad: 24, descripcion: 'División Transporte' },
      { id: 65, idUnidad: 24, descripcion: 'División Comunicaciones' },
      { id: 66, idUnidad: 25, descripcion: 'Secretaría' },
      { id: 67, idUnidad: 25, descripcion: 'División Relaciones Publicas' },
      { id: 68, idUnidad: 25, descripcion: 'División Imagen Institucional' },
      { id: 69, idUnidad: 25, descripcion: 'División Interacción Social' },
      {
        id: 70,
        idUnidad: 25,
        descripcion: 'División Relaciones Internacionales',
      },
      { id: 71, idUnidad: 26, descripcion: 'Secretaría' },
      { id: 72, idUnidad: 26, descripcion: 'División Personal' },
      { id: 73, idUnidad: 26, descripcion: 'División Planificación' },
      { id: 74, idUnidad: 26, descripcion: 'División Logística' },
      { id: 75, idUnidad: 26, descripcion: 'División Técnica' },
      { id: 76, idUnidad: 26, descripcion: 'División Evidencias' },
    ]

    const gruposData: {
      id: number
      idDistrital: number
      descripcion: string
    }[] = [
      { id: 1, idDistrital: 1, descripcion: 'Achica Arriba' },
      { id: 2, idDistrital: 1, descripcion: 'Patrullas La Paz' },
      { id: 3, idDistrital: 1, descripcion: 'Yucumo' },
      { id: 4, idDistrital: 1, descripcion: 'Vila Vila' },
      { id: 5, idDistrital: 2, descripcion: 'Bulo Bulo' },
      { id: 6, idDistrital: 2, descripcion: 'Locotal' },
      { id: 7, idDistrital: 2, descripcion: 'Suticollo' },
      { id: 8, idDistrital: 2, descripcion: 'Patrullas Cochabamba' },
      { id: 9, idDistrital: 3, descripcion: 'Montero' },
      { id: 10, idDistrital: 3, descripcion: 'KM-7 DIGCOIN' },
      { id: 11, idDistrital: 1, descripcion: 'Jefatura Nacional' },
      { id: 12, idDistrital: 4, descripcion: 'Corioco' },
      { id: 13, idDistrital: 4, descripcion: 'Km52' },
      { id: 14, idDistrital: 4, descripcion: 'Caranavi' },
      { id: 15, idDistrital: 5, descripcion: 'Locotal' },
      { id: 16, idDistrital: 5, descripcion: 'Chimore' },
      { id: 17, idDistrital: 5, descripcion: 'San German' },
      { id: 18, idDistrital: 5, descripcion: 'Castillo' },
      { id: 19, idDistrital: 6, descripcion: 'San Ignacio de Velasco' },
      { id: 20, idDistrital: 7, descripcion: 'Trinidad' },
      { id: 21, idDistrital: 36, descripcion: 'Cobija' },
      { id: 22, idDistrital: 8, descripcion: 'Eremo' },
      { id: 23, idDistrital: 8, descripcion: 'Investigadores' },
      { id: 24, idDistrital: 9, descripcion: 'Cochabamba' },
      { id: 25, idDistrital: 9, descripcion: 'Chapare' },
      { id: 26, idDistrital: 10, descripcion: 'GER Oriente' },
      { id: 27, idDistrital: 10, descripcion: 'Santa Cruz' },
      { id: 28, idDistrital: 11, descripcion: 'Investigadores' },
      { id: 29, idDistrital: 12, descripcion: 'Investigadores' },
      { id: 30, idDistrital: 13, descripcion: 'Investigadores' },
      { id: 31, idDistrital: 14, descripcion: 'Investigadores' },
      { id: 32, idDistrital: 15, descripcion: 'Investigadores' },
      { id: 33, idDistrital: 16, descripcion: 'Investigadores' },
      { id: 34, idDistrital: 17, descripcion: 'Investigadores' },
      { id: 35, idDistrital: 18, descripcion: 'Investigadores' },
      { id: 36, idDistrital: 19, descripcion: 'Investigadores' },
      { id: 37, idDistrital: 20, descripcion: 'Investigadores' },
      { id: 38, idDistrital: 21, descripcion: 'Investigadores' },
      { id: 39, idDistrital: 22, descripcion: 'Investigadores' },
      { id: 40, idDistrital: 23, descripcion: 'Investigadores' },
      { id: 41, idDistrital: 24, descripcion: 'Investigadores' },
      { id: 42, idDistrital: 25, descripcion: 'Investigadores' },
      { id: 43, idDistrital: 26, descripcion: 'Investigadores' },
      { id: 44, idDistrital: 3, descripcion: 'Patrullas Santa Cruz' },
      { id: 45, idDistrital: 3, descripcion: 'Santa Fe' },
      { id: 46, idDistrital: 4, descripcion: 'Apolo' },
      { id: 47, idDistrital: 4, descripcion: 'Guanay' },
      { id: 48, idDistrital: 4, descripcion: 'Irupana' },
      { id: 49, idDistrital: 4, descripcion: 'La Rinconada' },
      { id: 50, idDistrital: 6, descripcion: 'Montero' },
      { id: 51, idDistrital: 7, descripcion: 'Riberalta' },
      { id: 52, idDistrital: 6, descripcion: 'Puerto Quijarro' },
      { id: 53, idDistrital: 27, descripcion: 'Yacuiba' },
      { id: 54, idDistrital: 27, descripcion: 'Villamontes' },
      { id: 55, idDistrital: 28, descripcion: 'Trinidad' },
      { id: 56, idDistrital: 28, descripcion: 'Riberalta' },
      { id: 57, idDistrital: 28, descripcion: 'Guayaramerin' },
      { id: 58, idDistrital: 28, descripcion: 'Yucumo' },
      { id: 59, idDistrital: 28, descripcion: 'Cobija' },
      { id: 60, idDistrital: 28, descripcion: 'GER Amazonia' },
      { id: 61, idDistrital: 10, descripcion: 'Montero' },
      { id: 62, idDistrital: 10, descripcion: 'Yacuiba' },
      { id: 63, idDistrital: 33, descripcion: 'Jefatura Departamental' },
      { id: 64, idDistrital: 20, descripcion: 'Jefatura Departamental' },
      { id: 65, idDistrital: 25, descripcion: 'Jefatura Departamental' },
      { id: 66, idDistrital: 29, descripcion: 'Investigadores' },
      { id: 67, idDistrital: 30, descripcion: 'Investigadores' },
      { id: 68, idDistrital: 31, descripcion: 'Investigadores' },
      { id: 69, idDistrital: 32, descripcion: 'Investigadores' },
      { id: 70, idDistrital: 1, descripcion: 'Rinconada' },
      { id: 71, idDistrital: 27, descripcion: 'Bermejo' },
      { id: 72, idDistrital: 33, descripcion: 'Investigadores' },
      { id: 73, idDistrital: 34, descripcion: 'Investigadores' },
      { id: 74, idDistrital: 35, descripcion: 'Cochabamba' },
      { id: 75, idDistrital: 6, descripcion: 'Cotoca' },
      { id: 76, idDistrital: 6, descripcion: 'San Matias' },
      { id: 77, idDistrital: 6, descripcion: 'C.O.A.I.' },
      { id: 78, idDistrital: 1, descripcion: 'Laja' },
      { id: 79, idDistrital: 28, descripcion: 'Santa Ana del Yacuma' },
      { id: 80, idDistrital: 7, descripcion: 'Santa Ana del Yacuma' },
      { id: 81, idDistrital: 7, descripcion: 'Guayaramerin' },
      { id: 82, idDistrital: 7, descripcion: 'San Joaquin' },
      { id: 83, idDistrital: 7, descripcion: 'Yucumo' },
      { id: 84, idDistrital: 4, descripcion: 'Ixiamas' },
      { id: 85, idDistrital: 4, descripcion: 'Yolosa' },
      { id: 86, idDistrital: 22, descripcion: 'Jefatura Departamental' },
      { id: 87, idDistrital: 19, descripcion: 'Jefatura Departamental' },
      { id: 88, idDistrital: 34, descripcion: 'Jefatura Departamental' },
      { id: 89, idDistrital: 21, descripcion: 'Jefatura Departamental' },
      { id: 90, idDistrital: 23, descripcion: 'Jefatura Departamental' },
      { id: 91, idDistrital: 24, descripcion: 'Jefatura Departamental' },
      { id: 92, idDistrital: 5, descripcion: 'Ivirgarzama' },
      { id: 93, idDistrital: 5, descripcion: 'Ichoa' },
      { id: 94, idDistrital: 37, descripcion: 'Ayudantía de Ordenes' },
      { id: 95, idDistrital: 37, descripcion: 'Secretaría' },
      { id: 96, idDistrital: 37, descripcion: 'Registro y Archivos' },
      {
        id: 97,
        idDistrital: 37,
        descripcion: 'Guardia y Acceso Instalaciones',
      },
      { id: 98, idDistrital: 38, descripcion: 'Poligrafía' },
      { id: 99, idDistrital: 39, descripcion: 'Secretaría' },
      { id: 100, idDistrital: 40, descripcion: 'Tracto Administrativo' },
      { id: 101, idDistrital: 41, descripcion: 'Archivos' },
      {
        id: 102,
        idDistrital: 42,
        descripcion: 'Sección Registro de Casos y Estadísticas',
      },
      {
        id: 103,
        idDistrital: 43,
        descripcion: 'Sección Seguimiento Administrativo y DIRCABI',
      },
      { id: 104, idDistrital: 44, descripcion: 'Secretaría' },
      { id: 105, idDistrital: 45, descripcion: 'Secretaría' },
      {
        id: 106,
        idDistrital: 46,
        descripcion: 'Sección Asignación de Personal',
      },
      {
        id: 107,
        idDistrital: 46,
        descripcion: 'Sección Coordinación Interinstitucional',
      },
      {
        id: 108,
        idDistrital: 46,
        descripcion:
          'Sección Control y Seguimiento de Personal del Programa 12 TGN',
      },
      { id: 109, idDistrital: 47, descripcion: 'Capacitación y Evaluación' },
      {
        id: 110,
        idDistrital: 48,
        descripcion: 'Sección Archivo y File Personal',
      },
      {
        id: 111,
        idDistrital: 48,
        descripcion: 'Sección Administración Base de Datos',
      },
      {
        id: 112,
        idDistrital: 48,
        descripcion: 'Sección Digitalización y Acreditación',
      },
      { id: 113, idDistrital: 49, descripcion: 'Sección Trabajo Social' },
      { id: 114, idDistrital: 50, descripcion: 'Secretaría' },
      {
        id: 115,
        idDistrital: 51,
        descripcion: 'Sección Verificación y Seguimiento de Antecedentes',
      },
      {
        id: 116,
        idDistrital: 51,
        descripcion: 'Sección Certificación Nacional',
      },
      { id: 117, idDistrital: 51, descripcion: 'Sección Registro y Archivo' },
      { id: 118, idDistrital: 52, descripcion: 'Sección Entrega Vigilada' },
      { id: 119, idDistrital: 52, descripcion: 'Sección Agente Encubierto' },
      {
        id: 120,
        idDistrital: 52,
        descripcion: 'Sección Compensación al Riesgo del Informante',
      },
      { id: 121, idDistrital: 52, descripcion: 'Sección Colaborador Eficaz' },
      {
        id: 122,
        idDistrital: 53,
        descripcion: 'Sección Desarrollo e Innovación',
      },
      {
        id: 123,
        idDistrital: 53,
        descripcion:
          'Sección Administración del Centro de Procesamiento y Seguridad de la Inform',
      },
      {
        id: 124,
        idDistrital: 53,
        descripcion: 'Sección Investigación Tecnológica Antinarcóticos',
      },
      {
        id: 125,
        idDistrital: 54,
        descripcion:
          'Sección Centro Estratégico de Inteligencia Antinarcóticos',
      },
      {
        id: 126,
        idDistrital: 54,
        descripcion: 'Sección Centro Regional de Inteligencia Antinarcóticos',
      },
      { id: 127, idDistrital: 55, descripcion: 'Sección Occidente' },
      { id: 128, idDistrital: 55, descripcion: 'Sección Valle' },
      { id: 129, idDistrital: 55, descripcion: 'Sección Oriente' },
      { id: 130, idDistrital: 56, descripcion: 'Secretaría' },
      {
        id: 131,
        idDistrital: 57,
        descripcion: 'Sección Planificación Estratégica',
      },
      { id: 132, idDistrital: 57, descripcion: 'Sección Reglamentación' },
      { id: 133, idDistrital: 58, descripcion: 'Sección Planes y Ordenes' },
      {
        id: 134,
        idDistrital: 58,
        descripcion: 'Sección Control y Seguimiento',
      },
      {
        id: 135,
        idDistrital: 59,
        descripcion: 'Sección Registro y Base de Datos',
      },
      {
        id: 136,
        idDistrital: 59,
        descripcion: 'Sección Análisis y Producción Estadística',
      },
      { id: 137, idDistrital: 60, descripcion: 'Secretaría' },
      { id: 138, idDistrital: 61, descripcion: 'Sección Presupuesto' },
      { id: 139, idDistrital: 61, descripcion: 'Sección Contrataciones' },
      { id: 140, idDistrital: 61, descripcion: 'Sección Contabilidad' },
      { id: 141, idDistrital: 61, descripcion: 'Sección Gestión Salarial' },
      { id: 142, idDistrital: 62, descripcion: 'Sección Armamento y Equipo' },
      { id: 143, idDistrital: 62, descripcion: 'Sección Almacén' },
      { id: 144, idDistrital: 62, descripcion: 'Sección Servicios Generales' },
      { id: 145, idDistrital: 63, descripcion: 'Sección Mantenimiento' },
      { id: 146, idDistrital: 63, descripcion: 'Sección Activos Fijos' },
      { id: 147, idDistrital: 64, descripcion: 'Sección Control de Vehículos' },
      { id: 148, idDistrital: 64, descripcion: 'Sección Talleres' },
      { id: 149, idDistrital: 64, descripcion: 'Sección Repuestos' },
      { id: 150, idDistrital: 64, descripcion: 'Sección Combustible' },
      {
        id: 151,
        idDistrital: 65,
        descripcion: 'Sección Control de Equipo Comunicación',
      },
      {
        id: 152,
        idDistrital: 65,
        descripcion: 'Sección Mantenimiento y Reparación',
      },
      { id: 153, idDistrital: 66, descripcion: 'Secretaría' },
      { id: 154, idDistrital: 67, descripcion: 'Sección Comunicación' },
      { id: 155, idDistrital: 67, descripcion: 'Sección Redes Sociales' },
      {
        id: 156,
        idDistrital: 67,
        descripcion: 'Sección Ceremonial y Protocolo',
      },
      { id: 157, idDistrital: 68, descripcion: 'Sección Diseño' },
      {
        id: 158,
        idDistrital: 68,
        descripcion: 'Sección Producción Audiovisual',
      },
      { id: 159, idDistrital: 69, descripcion: 'Sección Prevención' },
      { id: 160, idDistrital: 69, descripcion: 'Sección Acciones Cívicas' },
      { id: 161, idDistrital: 70, descripcion: 'Relaciones Internacionales' },
      { id: 162, idDistrital: 71, descripcion: 'Secretaría' },
      { id: 163, idDistrital: 72, descripcion: 'Personal' },
      { id: 164, idDistrital: 73, descripcion: 'Planificación' },
      { id: 165, idDistrital: 74, descripcion: 'Logística' },
      {
        id: 166,
        idDistrital: 75,
        descripcion: 'Sección Análisis Físico Químico y Toxicológico',
      },
      { id: 167, idDistrital: 75, descripcion: 'Sección Instrumental' },
      {
        id: 168,
        idDistrital: 76,
        descripcion:
          'Sección Recepción de Muestras, Custodia, de Evidencias y Seguimiento de Cas',
      },
      { id: 169, idDistrital: 6, descripcion: 'KEMPF' },
    ]

    // Orden respetando las FK: unidad -> distrital -> grupo
    await queryRunner.manager.save(
      unidadesData.map((x) => new Unidad({ ...x, ...auditoria }))
    )
    await queryRunner.manager.save(
      distritalesData.map((x) => new Distrital({ ...x, ...auditoria }))
    )
    await queryRunner.manager.save(
      gruposData.map((x) => new Grupo({ ...x, ...auditoria }))
    )

    // Alinear las secuencias con el MAX(id) insertado explícitamente
    for (const tabla of ['unidad', 'distrital', 'grupo']) {
      await queryRunner.query(
        `SELECT setval(pg_get_serial_sequence('${schema}.${tabla}', 'id'), (SELECT MAX(id) FROM ${schema}.${tabla}), true)`
      )
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
