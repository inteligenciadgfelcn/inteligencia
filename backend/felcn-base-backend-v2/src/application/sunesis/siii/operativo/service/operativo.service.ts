import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BaseService } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
import { OperativoRepository } from '../repository/operativo.repository'
import { AsignacionSiiiRepository } from '../../asignacion/repository/asignacion-siii.repository'

// Entities
import { Operativo } from '../entity/operativo.entity'
import { Droga } from '../entity/droga.entity'
import { SustanciaSolida } from '../entity/sustancia-solida.entity'
import { SustanciaLiquida } from '../entity/sustancia-liquida.entity'
import { Fabrica } from '../entity/fabrica.entity'
import { ItemBienSecuestrado } from '../entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from '../entity/item-bien-caracteristica.entity'
import { DetenidoAuxiliar } from '../entity/detenido-auxiliar.entity'
import { Galeria } from '../entity/galeria.entity'
import { Logotipo } from '../entity/logotipo.entity'

// DTOs
import {
  OperativoDto,
  CreateDrogaDto,
  CreateDetenidoDto,
  CreateBienSecuestradoDto,
  CreateBienCaracteristicaDto,
  CreateFabricaDto,
  CreateSustanciaSolidaDto,
  CreateSustanciaLiquidaDto,
  CreateGaleriaDto,
  CreateLogotipoDto,
} from '../dto'

@Injectable()
export class OperativoService extends BaseService {
  constructor(
    private readonly operativoRepository: OperativoRepository,
    private readonly asignacionSiiiRepository: AsignacionSiiiRepository
  ) {
    super()
  }

  // ==================== OPERATIVO PRINCIPAL ====================

  /**
   * GET /caso/:idCaso — datos del caso + lista de todos sus operativos (1:N).
   * El frontend selecciona cuál operativo editar o crea uno nuevo.
   */
  async getOrInit(idCaso: string): Promise<any> {
    const asignacion = await this.asignacionSiiiRepository.buscarPorId(idCaso)
    if (!asignacion) {
      throw new NotFoundException(`Caso con ID ${idCaso} no encontrado`)
    }

    const caso = {
      idCaso: asignacion.idCaso,
      numeroOperativo: asignacion.numeroOperativo,
      nombreCaso: asignacion.nombreCaso,
      fiscalSolicitud: asignacion.fiscalSolicitud,
      telefonoSolicitud: asignacion.telefonoSolicitud,
      asignadoCaso: asignacion.asignadoCaso,
      telefonoAsignado: asignacion.telefonoAsignado,
      fiscalAsignadoCaso: asignacion.fiscalAsignadoCaso,
      telefonoFiscal: asignacion.telefonoFiscal,
    }

    const operativos = await this.operativoRepository.buscarPorCaso(idCaso)

    return { caso, operativos }
  }

  /**
   * POST /caso/:idCaso — crea un nuevo operativo para el caso.
   * Un caso puede tener múltiples operativos (1:N).
   * Retorna el operativo con su idOperativo para usar en las secciones.
   */
  async crear(idCaso: string, dto: OperativoDto, usuario: string): Promise<Operativo> {
    const asignacion = await this.asignacionSiiiRepository.buscarPorId(idCaso)
    if (!asignacion) {
      throw new NotFoundException(`Caso con ID ${idCaso} no encontrado`)
    }

    const operativo = new Operativo({
      ...dto,
      idCaso,
      fechaOperativo: new Date(dto.fechaOperativo),
      usuario,
    })
    return this.operativoRepository.crearOperativo(operativo)
  }

  /**
   * PATCH /:idOperativo — actualiza el operativo por su ID.
   */
  async actualizar(
    idOperativo: string,
    dto: OperativoDto,
    usuario: string
  ): Promise<Operativo> {
    const operativo = await this.buscarPorId(idOperativo)
    Object.assign(operativo, { ...dto, fechaOperativo: new Date(dto.fechaOperativo) })
    return this.operativoRepository.actualizarOperativo(operativo)
  }

  async listar(paginacion: PaginacionQueryDto): Promise<[Operativo[], number]> {
    return this.operativoRepository.listar(paginacion)
  }

  async buscarPorId(id: string): Promise<Operativo> {
    const operativo = await this.operativoRepository.buscarPorId(id)
    if (!operativo) {
      throw new NotFoundException(`Operativo con ID ${id} no encontrado`)
    }
    return operativo
  }

  async buscarPorCaso(idCaso: string): Promise<Operativo[]> {
    return this.operativoRepository.buscarPorCaso(idCaso)
  }

  // ==================== DROGAS ====================

  async agregarDroga(
    idOperativo: string,
    data: CreateDrogaDto,
    pruebaCampo: Buffer,
    pesaje: Buffer,
    usuario: string
  ): Promise<any> {
    const drogaEntity = new Droga({
      idOperativo,
      ...data,
      fotoPruebaCampo: pruebaCampo.length ? pruebaCampo : undefined,
      fotoPesaje: pesaje.length ? pesaje : undefined,
      usuario,
    })
    const droga = await this.operativoRepository.crearDroga(drogaEntity)
    const { fotoPruebaCampo, fotoPesaje, ...resto } = droga
    return {
      ...resto,
      urlFotoPruebaCampo: fotoPruebaCampo?.length
        ? `/api/operativos/${idOperativo}/drogas/${droga.id}/fotos/prueba-campo`
        : null,
      urlFotoPesaje: fotoPesaje?.length
        ? `/api/operativos/${idOperativo}/drogas/${droga.id}/fotos/pesaje`
        : null,
    }
  }

  async listarDrogas(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [drogas, total] = await this.operativoRepository.listarDrogasPorOperativo(idOperativo, paginacion)
    const filas = drogas.map(({ fotoPruebaCampo, fotoPesaje, estadoDroga, formaTransporte, paisProcedencia, paisDestino, operativo, ...d }) => ({
      ...d,
      idTipoDroga: estadoDroga?.idTipoDroga ?? null,
      descripcionEstadoDroga: estadoDroga?.descripcion ?? null,
      descripcionTipoDroga: estadoDroga?.tipoDroga?.descripcion ?? null,
      descripcionFormaTransporte: formaTransporte?.descripcion ?? null,
      descripcionPaisProcedencia: paisProcedencia?.descripcion ?? null,
      descripcionPaisDestino: paisDestino?.descripcion ?? null,
      urlFotoPruebaCampo: fotoPruebaCampo?.length
        ? `/api/operativos/${idOperativo}/drogas/${d.id}/fotos/prueba-campo`
        : null,
      urlFotoPesaje: fotoPesaje?.length
        ? `/api/operativos/${idOperativo}/drogas/${d.id}/fotos/pesaje`
        : null,
    }))
    return [filas, total]
  }

  async eliminarDroga(idOperativo: string, idDroga: string): Promise<void> {
    await this.operativoRepository.eliminarDroga(idDroga)
  }

  async obtenerPesajeDrogas(idOperativo: string): Promise<any> {
    return this.operativoRepository.obtenerResumenDrogas(idOperativo)
  }

  async obtenerFotoDroga(
    idOperativo: string,
    idDroga: string,
    tipo: 'prueba-campo' | 'pesaje'
  ): Promise<Buffer> {
    const droga = await this.operativoRepository.buscarDrogaPorId(idDroga)
    if (!droga || droga.idOperativo !== idOperativo) {
      throw new NotFoundException(`Droga con ID ${idDroga} no encontrada`)
    }
    return tipo === 'prueba-campo'
      ? droga.fotoPruebaCampo || Buffer.alloc(0)
      : droga.fotoPesaje || Buffer.alloc(0)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  async agregarSustanciaSolida(
    idOperativo: string,
    data: CreateSustanciaSolidaDto,
    usuario: string
  ): Promise<SustanciaSolida> {
    const sustancia = new SustanciaSolida({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearSustanciaSolida(sustancia)
  }

  async listarSustanciasSolidas(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [sustancias, total] = await this.operativoRepository.listarSustanciasSolidasPorOperativo(idOperativo, paginacion)
    const filas = sustancias.map(({ descripcionRef, operativo, ...s }) => ({
      ...s,
      descripcionSustancia: descripcionRef?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarSustanciaSolida(idOperativo: string, idSustancia: string): Promise<void> {
    await this.operativoRepository.eliminarSustanciaSolida(idSustancia)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  async agregarSustanciaLiquida(
    idOperativo: string,
    data: CreateSustanciaLiquidaDto,
    usuario: string
  ): Promise<SustanciaLiquida> {
    const sustancia = new SustanciaLiquida({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearSustanciaLiquida(sustancia)
  }

  async listarSustanciasLiquidas(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [sustancias, total] = await this.operativoRepository.listarSustanciasLiquidasPorOperativo(idOperativo, paginacion)
    const filas = sustancias.map(({ descripcionRef, operativo, ...s }) => ({
      ...s,
      descripcionSustancia: descripcionRef?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarSustanciaLiquida(idOperativo: string, idSustancia: string): Promise<void> {
    await this.operativoRepository.eliminarSustanciaLiquida(idSustancia)
  }

  // ==================== FÁBRICAS ====================

  async agregarFabrica(
    idOperativo: string,
    data: CreateFabricaDto,
    usuario: string
  ): Promise<Fabrica> {
    const fabrica = new Fabrica({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearFabrica(fabrica)
  }

  async listarFabricas(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [fabricas, total] = await this.operativoRepository.listarFabricasPorOperativo(idOperativo, paginacion)
    const filas = fabricas.map(({ fabricaModelo, operativo, ...f }) => ({
      ...f,
      idTipoFabrica: fabricaModelo?.idTipoFabrica ?? null,
      descripcionFabricaModelo: fabricaModelo?.descripcion ?? null,
      descripcionTipoFabrica: fabricaModelo?.tipoFabrica?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarFabrica(idOperativo: string, idFabrica: string): Promise<void> {
    await this.operativoRepository.eliminarFabrica(idFabrica)
  }

  // ==================== BIENES SECUESTRADOS ====================

  async agregarBien(
    idOperativo: string,
    data: CreateBienSecuestradoDto,
    usuario: string,
    foto?: Buffer
  ): Promise<ItemBienSecuestrado> {
    const bien = new ItemBienSecuestrado({
      idOperativo,
      idCatalogoTipo: data.idCatalogoTipo,
      cantidadBien: data.cantidadBien,
      costoAproximado: data.costoAproximado ?? 0,
      costoCuantificado: data.costoCuantificado ?? 0,
      enInvestigacion: data.enInvestigacion ?? false,
      fotoBien: foto?.length ? foto : undefined,
      usuario,
    })
    return this.operativoRepository.crearBien(bien)
  }

  async listarBienes(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [bienes, total] = await this.operativoRepository.listarBienesPorOperativo(idOperativo, paginacion)
    const filas = bienes.map(({ fotoBien, catalogoTipo, operativo, ...b }) => ({
      ...b,
      idCatalogoClase: catalogoTipo?.idCatalogoClase ?? null,
      idBien: catalogoTipo?.catalogoClase?.idBien ?? null,
      descripcionCatalogoTipo: catalogoTipo?.descripcion ?? null,
      descripcionCatalogoClase: catalogoTipo?.catalogoClase?.descripcion ?? null,
      descripcionBien: catalogoTipo?.catalogoClase?.bien?.descripcion ?? null,
      urlFotoBien: fotoBien?.length
        ? `/api/operativos/${idOperativo}/bienes/${b.id}/foto`
        : null,
    }))
    return [filas, total]
  }

  async eliminarBien(idOperativo: string, idBien: string): Promise<void> {
    await this.operativoRepository.eliminarBien(idBien)
  }

  // ==================== CARACTERÍSTICAS DE BIENES ====================

  async agregarCaracteristicaBien(
    idOperativo: string,
    idBien: string,
    data: CreateBienCaracteristicaDto,
    usuario: string
  ): Promise<ItemBienCaracteristica> {
    const bien = await this.operativoRepository.buscarBienPorId(idBien)
    if (!bien || bien.idOperativo !== idOperativo) {
      throw new NotFoundException(`Bien con ID ${idBien} no encontrado`)
    }
    const caracteristica = new ItemBienCaracteristica({
      idItemBienSecuestrado: idBien,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearBienCaracteristica(caracteristica)
  }

  async listarCaracteristicasBien(
    idOperativo: string,
    idBien: string,
    paginacion: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const [caracteristicas, total] = await this.operativoRepository.listarCaracteristicasPorBien(idBien, paginacion)
    const filas = caracteristicas.map(({ catalogoCaracteristica, itemBienSecuestrado, ...c }) => ({
      ...c,
      descripcionCaracteristica: catalogoCaracteristica?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarCaracteristicaBien(
    idOperativo: string,
    idBien: string,
    idCaracteristica: string
  ): Promise<void> {
    const caracteristica = await this.operativoRepository.buscarBienCaracteristica(idCaracteristica)
    if (!caracteristica) {
      throw new NotFoundException(`Característica con ID ${idCaracteristica} no encontrada`)
    }
    if (caracteristica.idItemBienSecuestrado !== idBien) {
      throw new NotFoundException(`La característica ${idCaracteristica} no pertenece al bien ${idBien}`)
    }
    await this.operativoRepository.eliminarBienCaracteristica(idCaracteristica)
  }

  // ==================== DETENIDOS ====================

  async agregarDetenido(
    idOperativo: string,
    data: CreateDetenidoDto,
    usuario: string
  ): Promise<DetenidoAuxiliar> {
    const detenido = new DetenidoAuxiliar({
      idOperativo,
      idPais: data.idPais,
      idTipoDocumento: data.idTipoDocumento,
      nombres: data.nombres,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno ?? '',
      apellidoEsposo: data.apellidoEsposo ?? '',
      nroDocumento: data.nroDocumento,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
      genero: data.genero,
      direccion: data.direccion,
      estado: data.estado,
      usuario,
    })
    return this.operativoRepository.crearDetenido(detenido)
  }

  async listarDetenidos(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [detenidos, total] = await this.operativoRepository.listarDetenidosPorOperativo(idOperativo, paginacion)
    const filas = detenidos.map(({ fotoFrente, fotoPerfilDerecho, fotoPerfilIzquierdo, paisNacionalidad, tipoDocumento, operativo, ...d }) => ({
      ...d,
      descripcionPais: paisNacionalidad?.descripcion ?? null,
      descripcionTipoDocumento: tipoDocumento?.descripcion ?? null,
      urlFotoFrente: fotoFrente?.length
        ? `/api/operativos/${idOperativo}/detenidos/${d.id}/fotos/frente`
        : null,
      urlFotoPerfilDerecho: fotoPerfilDerecho?.length
        ? `/api/operativos/${idOperativo}/detenidos/${d.id}/fotos/perfil-derecho`
        : null,
      urlFotoPerfilIzquierdo: fotoPerfilIzquierdo?.length
        ? `/api/operativos/${idOperativo}/detenidos/${d.id}/fotos/perfil-izquierdo`
        : null,
    }))
    return [filas, total]
  }

  async eliminarDetenido(idOperativo: string, idDetenido: string): Promise<void> {
    await this.operativoRepository.eliminarDetenido(idDetenido)
  }

  async actualizarFotoDetenido(
    idOperativo: string,
    idDetenido: string,
    tipo: 'frente' | 'perfil-derecho' | 'perfil-izquierdo',
    foto: Buffer
  ): Promise<void> {
    const detenido = await this.operativoRepository.buscarDetenidoPorId(idDetenido)
    if (!detenido || detenido.idOperativo !== idOperativo) {
      throw new NotFoundException(`Detenido con ID ${idDetenido} no encontrado`)
    }
    const campoMap = {
      'frente': 'foto_frente',
      'perfil-derecho': 'foto_perfil_derecho',
      'perfil-izquierdo': 'foto_perfil_izquierdo',
    } as const
    await this.operativoRepository.actualizarFotoDetenido(idDetenido, campoMap[tipo], foto)
  }

  // ==================== GALERÍA ====================

  async agregarFotoGaleria(
    idOperativo: string,
    data: CreateGaleriaDto,
    foto: Buffer,
    usuario: string
  ): Promise<Galeria> {
    const galeria = new Galeria({ idOperativo, descripcion: data.descripcion, foto })
    return this.operativoRepository.crearGaleria(galeria)
  }

  async listarGaleria(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[Galeria[], number]> {
    return this.operativoRepository.listarGaleriaPorOperativo(idOperativo, paginacion)
  }

  async eliminarFotoGaleria(idOperativo: string, idGaleria: string): Promise<void> {
    await this.operativoRepository.eliminarGaleria(idGaleria)
  }

  // ==================== LOGOTIPOS ====================

  async agregarLogotipo(
    idOperativo: string,
    data: CreateLogotipoDto,
    fotografia: Buffer,
    usuario: string
  ): Promise<any> {
    const operativo = await this.buscarPorId(idOperativo)
    const asignacion = await this.asignacionSiiiRepository.buscarPorId(operativo.idCaso)

    const logotipoEntity = new Logotipo({
      idOperativo,
      numeroCaso: asignacion?.nombreCaso || '',
      numeroOperativo: operativo.numeroOperativo,
      fechaOperativo: operativo.fechaOperativo,
      nombreCaso: asignacion?.nombreCaso || '',
      descripcion: operativo.descripcion,
      imagen: data.imagen,
      descripcionLogo: data.descripcionLogo,
      idTipoDroga: data.idTipoDroga,
      idPaisOrigen: data.idPaisOrigen,
      idPaisDestino: data.idPaisDestino,
      organizacion: data.organizacion,
      blanco: data.blanco || '',
      observacion: data.observacion || '',
      enlace: data.enlace || '',
      fotografia,
      usuario,
    })
    const logotipo = await this.operativoRepository.crearLogotipo(logotipoEntity)
    const { fotografia: foto, ...resto } = logotipo
    return {
      ...resto,
      urlFotografia: foto?.length
        ? `/api/operativos/${idOperativo}/logotipos/${logotipo.id}/foto`
        : null,
    }
  }

  async listarLogotipos(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const [logotipos, total] = await this.operativoRepository.listarLogotiposPorOperativo(idOperativo, paginacion)
    const filas = logotipos.map(({ fotografia, tipoDroga, paisOrigen, paisDestino, operativo, ...l }) => ({
      ...l,
      descripcionTipoDroga: tipoDroga?.descripcion ?? null,
      descripcionPaisOrigen: paisOrigen?.descripcion ?? null,
      descripcionPaisDestino: paisDestino?.descripcion ?? null,
      urlFotografia: fotografia?.length
        ? `/api/operativos/${idOperativo}/logotipos/${l.id}/foto`
        : null,
    }))
    return [filas, total]
  }

  async eliminarLogotipo(idOperativo: string, idLogotipo: string): Promise<void> {
    await this.operativoRepository.eliminarLogotipo(idLogotipo)
  }

  // ==================== CATÁLOGOS ====================

  async listarEstadosDroga(idTipoDroga: number) {
    return this.operativoRepository.listarEstadosDrogaPorTipo(idTipoDroga)
  }

  async listarFabricaModelos(idTipoFabrica: number) {
    return this.operativoRepository.listarFabricaModelosPorTipo(idTipoFabrica)
  }

  async listarItemsOperativo(idCategoriaOperativo: number) {
    return this.operativoRepository.listarItemsOperativoPorCategoria(idCategoriaOperativo)
  }

  async listarCatalogoClases(idBien: number) {
    return this.operativoRepository.listarCatalogoClasesPorBien(idBien)
  }

  async listarCatalogoTipos(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoTiposPorClase(idCatalogoClase)
  }

  async listarCatalogoCaracteristicas(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoCaracteristicasPorClase(idCatalogoClase)
  }

  // ==================== CASOS DE USUARIO ====================

  async listarCasosPorUsuario(usuario: string): Promise<any[]> {
    return this.asignacionSiiiRepository.buscarTodosPorUsuario(usuario)
  }

  async listarCasosNoAprobados(usuario: string): Promise<any[]> {
    return this.asignacionSiiiRepository.buscarNoAprobadosPorUsuario(usuario)
  }

  // ==================== IMÁGENES (LAZY LOADING) ====================

  async obtenerFotoGaleria(idOperativo: string, idFoto: string): Promise<Buffer> {
    const galeria = await this.operativoRepository.buscarGaleriaPorId(idFoto)
    if (!galeria || galeria.idOperativo !== idOperativo) {
      throw new NotFoundException(`Foto de galería con ID ${idFoto} no encontrada`)
    }
    return galeria.foto
  }

  async obtenerFotoDetenido(
    idOperativo: string,
    idDetenido: string,
    tipo: 'frente' | 'perfil-derecho' | 'perfil-izquierdo'
  ): Promise<Buffer> {
    const detenido = await this.operativoRepository.buscarDetenidoPorId(idDetenido)
    if (!detenido || detenido.idOperativo !== idOperativo) {
      throw new NotFoundException(`Detenido con ID ${idDetenido} no encontrado`)
    }
    switch (tipo) {
      case 'frente':        return detenido.fotoFrente || Buffer.alloc(0)
      case 'perfil-derecho':  return detenido.fotoPerfilDerecho || Buffer.alloc(0)
      case 'perfil-izquierdo': return detenido.fotoPerfilIzquierdo || Buffer.alloc(0)
      default: throw new NotFoundException(`Tipo de foto "${tipo}" no válido`)
    }
  }

  async obtenerFotoBien(idOperativo: string, idBien: string): Promise<Buffer> {
    const bien = await this.operativoRepository.buscarBienPorId(idBien)
    if (!bien || bien.idOperativo !== idOperativo) {
      throw new NotFoundException(`Bien con ID ${idBien} no encontrado`)
    }
    return bien.fotoBien || Buffer.alloc(0)
  }

  async obtenerFotoLogotipo(idOperativo: string, idLogotipo: string): Promise<Buffer> {
    const logotipo = await this.operativoRepository.buscarLogotipoPorId(idLogotipo)
    if (!logotipo || logotipo.idOperativo !== idOperativo) {
      throw new NotFoundException(`Logotipo con ID ${idLogotipo} no encontrado`)
    }
    return logotipo.fotografia || Buffer.alloc(0)
  }
}
