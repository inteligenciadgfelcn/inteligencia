import {
  Injectable,
  NotFoundException,
  ConflictException,
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

  // ==================== HELPERS PRIVADOS ====================

  /**
   * Resuelve idCaso → idOperativo. Lanza 409 si se quiere crear y ya existe,
   * o 404 si se quiere operar sobre secciones sin operativo.
   */
  private async resolverIdOperativo(idCaso: string): Promise<string> {
    const operativo = await this.operativoRepository.resolverPorCaso(idCaso)
    if (!operativo) {
      throw new NotFoundException(
        `No existe operativo para el caso ${idCaso}. Debe crearlo primero.`
      )
    }
    return operativo.id
  }

  /**
   * Como resolverIdOperativo pero retorna null en vez de lanzar —
   * para GET de secciones (retorna [] si no hay operativo).
   */
  private async resolverIdOperativoOpcional(
    idCaso: string
  ): Promise<string | null> {
    const operativo = await this.operativoRepository.resolverPorCaso(idCaso)
    return operativo ? operativo.id : null
  }

  // ==================== OPERATIVO PRINCIPAL ====================

  /**
   * GET unificado: datos del caso (de asignacion, siempre frescos) +
   * operativo (null si aún no existe, entity completo si existe).
   * El frontend determina nuevo vs edición verificando operativo === null.
   */
  async getOrInit(idCaso: string): Promise<any> {
    const asignacion = await this.asignacionSiiiRepository.buscarPorId(idCaso)
    if (!asignacion) {
      throw new NotFoundException(`Caso con ID ${idCaso} no encontrado`)
    }

    // caso: datos de referencia del sistema SIII (asignacion), siempre frescos,
    // nunca se envían en POST/PATCH — son solo contexto de lectura para el formulario.
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

    // operativo: lo que el usuario guardó en la tabla operativo.
    // null si aún no existe → formulario nuevo.
    const operativo = await this.operativoRepository.resolverPorCaso(idCaso)

    return { caso, operativo }
  }

  /**
   * POST /caso/:idCaso — crea el operativo.
   * Toma numeroOperativo de asignacion. Lanza 409 si ya existe.
   */
  async crear(idCaso: string, dto: OperativoDto, usuario: string): Promise<Operativo> {
    const existente = await this.operativoRepository.resolverPorCaso(idCaso)
    if (existente) {
      throw new ConflictException(
        `El operativo para el caso ${idCaso} ya existe. Use PATCH para actualizar.`
      )
    }

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
   * PATCH /caso/:idCaso — actualiza el operativo.
   * Resuelve idCaso → idOperativo internamente. Lanza 404 si no existe.
   */
  async actualizar(
    idCaso: string,
    dto: OperativoDto,
    usuarioModificacion: string
  ): Promise<Operativo> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
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

  async buscarPorNumeroOperativo(numeroOperativo: string): Promise<Operativo> {
    const operativo =
      await this.operativoRepository.buscarPorNumeroOperativo(numeroOperativo)
    if (!operativo) {
      throw new NotFoundException(
        `Operativo con número ${numeroOperativo} no encontrado`
      )
    }
    return operativo
  }


  // ==================== DROGAS ====================

  async agregarDroga(
    idCaso: string,
    data: CreateDrogaDto,
    pruebaCampo: Buffer,
    pesaje: Buffer,
    usuario: string
  ): Promise<any> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
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
        ? `/api/operativos/caso/${idCaso}/drogas/${droga.id}/fotos/prueba-campo`
        : null,
      urlFotoPesaje: fotoPesaje?.length
        ? `/api/operativos/caso/${idCaso}/drogas/${droga.id}/fotos/pesaje`
        : null,
    }
  }

  async listarDrogas(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
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
        ? `/api/operativos/caso/${idCaso}/drogas/${d.id}/fotos/prueba-campo`
        : null,
      urlFotoPesaje: fotoPesaje?.length
        ? `/api/operativos/caso/${idCaso}/drogas/${d.id}/fotos/pesaje`
        : null,
    }))
    return [filas, total]
  }

  async eliminarDroga(idCaso: string, idDroga: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarDroga(idDroga)
  }

  async obtenerPesajeDrogas(idCaso: string): Promise<any> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return { totalGramos: 0, totalRegistros: 0 }
    return this.operativoRepository.obtenerResumenDrogas(idOperativo)
  }

  async obtenerFotoDroga(
    idCaso: string,
    idDroga: string,
    tipo: 'prueba-campo' | 'pesaje'
  ): Promise<Buffer> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const droga = await this.operativoRepository.buscarDrogaPorId(idDroga)
    if (!droga) {
      throw new NotFoundException(`Droga con ID ${idDroga} no encontrada`)
    }
    if (droga.idOperativo !== idOperativo) {
      throw new NotFoundException(
        `La droga ${idDroga} no pertenece al operativo del caso ${idCaso}`
      )
    }
    return tipo === 'prueba-campo'
      ? droga.fotoPruebaCampo || Buffer.alloc(0)
      : droga.fotoPesaje || Buffer.alloc(0)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  async agregarSustanciaSolida(
    idCaso: string,
    data: CreateSustanciaSolidaDto,
    usuario: string
  ): Promise<SustanciaSolida> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const sustancia = new SustanciaSolida({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearSustanciaSolida(sustancia)
  }

  async listarSustanciasSolidas(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [sustancias, total] = await this.operativoRepository.listarSustanciasSolidasPorOperativo(idOperativo, paginacion)
    const filas = sustancias.map(({ descripcionRef, operativo, ...s }) => ({
      ...s,
      descripcionSustancia: descripcionRef?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarSustanciaSolida(idCaso: string, idSustancia: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarSustanciaSolida(idSustancia)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  async agregarSustanciaLiquida(
    idCaso: string,
    data: CreateSustanciaLiquidaDto,
    usuario: string
  ): Promise<SustanciaLiquida> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const sustancia = new SustanciaLiquida({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearSustanciaLiquida(sustancia)
  }

  async listarSustanciasLiquidas(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [sustancias, total] = await this.operativoRepository.listarSustanciasLiquidasPorOperativo(idOperativo, paginacion)
    const filas = sustancias.map(({ descripcionRef, operativo, ...s }) => ({
      ...s,
      descripcionSustancia: descripcionRef?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarSustanciaLiquida(idCaso: string, idSustancia: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarSustanciaLiquida(idSustancia)
  }

  // ==================== FÁBRICAS ====================

  async agregarFabrica(
    idCaso: string,
    data: CreateFabricaDto,
    usuario: string
  ): Promise<Fabrica> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const fabrica = new Fabrica({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearFabrica(fabrica)
  }

  async listarFabricas(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [fabricas, total] = await this.operativoRepository.listarFabricasPorOperativo(idOperativo, paginacion)
    const filas = fabricas.map(({ fabricaModelo, operativo, ...f }) => ({
      ...f,
      idTipoFabrica: fabricaModelo?.idTipoFabrica ?? null,
      descripcionFabricaModelo: fabricaModelo?.descripcion ?? null,
      descripcionTipoFabrica: fabricaModelo?.tipoFabrica?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarFabrica(idCaso: string, idFabrica: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarFabrica(idFabrica)
  }

  // ==================== BIENES SECUESTRADOS ====================

  async agregarBien(
    idCaso: string,
    data: CreateBienSecuestradoDto,
    usuario: string
  ): Promise<ItemBienSecuestrado> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const bien = new ItemBienSecuestrado({ idOperativo, ...data, usuario })
    return this.operativoRepository.crearBien(bien)
  }

  async listarBienes(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [bienes, total] = await this.operativoRepository.listarBienesPorOperativo(idOperativo, paginacion)
    const filas = bienes.map(({ fotoBien, catalogoTipo, operativo, ...b }) => ({
      ...b,
      idCatalogoClase: catalogoTipo?.idCatalogoClase ?? null,
      idBien: catalogoTipo?.catalogoClase?.idBien ?? null,
      descripcionCatalogoTipo: catalogoTipo?.descripcion ?? null,
      descripcionCatalogoClase: catalogoTipo?.catalogoClase?.descripcion ?? null,
      descripcionBien: catalogoTipo?.catalogoClase?.bien?.descripcion ?? null,
      urlFotoBien: fotoBien?.length
        ? `/api/operativos/caso/${idCaso}/bienes/${b.id}/foto`
        : null,
    }))
    return [filas, total]
  }

  async eliminarBien(idCaso: string, idBien: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarBien(idBien)
  }

  // ==================== CARACTERÍSTICAS DE BIENES ====================

  async agregarCaracteristicaBien(
    idCaso: string,
    idBien: string,
    data: CreateBienCaracteristicaDto,
    usuario: string
  ): Promise<ItemBienCaracteristica> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
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
    idCaso: string,
    idBien: string,
    paginacion: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [caracteristicas, total] = await this.operativoRepository.listarCaracteristicasPorBien(idBien, paginacion)
    const filas = caracteristicas.map(({ catalogoCaracteristica, itemBienSecuestrado, ...c }) => ({
      ...c,
      descripcionCaracteristica: catalogoCaracteristica?.descripcion ?? null,
    }))
    return [filas, total]
  }

  async eliminarCaracteristicaBien(
    idCaso: string,
    idBien: string,
    idCaracteristica: string
  ): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    const caracteristica =
      await this.operativoRepository.buscarBienCaracteristica(idCaracteristica)
    if (!caracteristica) {
      throw new NotFoundException(
        `Característica con ID ${idCaracteristica} no encontrada`
      )
    }
    if (caracteristica.idItemBienSecuestrado !== idBien) {
      throw new NotFoundException(
        `La característica ${idCaracteristica} no pertenece al bien ${idBien}`
      )
    }
    await this.operativoRepository.eliminarBienCaracteristica(idCaracteristica)
  }

  // ==================== DETENIDOS ====================

  async agregarDetenido(
    idCaso: string,
    data: CreateDetenidoDto,
    usuario: string
  ): Promise<DetenidoAuxiliar> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const detenido = new DetenidoAuxiliar({
      idOperativo,
      ...data,
      fechaNacimiento: data.fechaNacimiento
        ? new Date(data.fechaNacimiento)
        : undefined,
      apellidoMaterno: data.apellidoMaterno || '*',
      apellidoEsposo: data.apellidoEsposo || '*',
      serie: data.serie || '',
      seccion: data.seccion || '',
      observaciones: data.observaciones || '',
      esActual: true,
      esRevisionIcia: false,
      tieneTarjeta: false,
      estaVivo: true,
      observacionesAdicionales: '',
      usuario,
      usuarioActualizacion: usuario,
    })
    return this.operativoRepository.crearDetenido(detenido)
  }

  async listarDetenidos(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [detenidos, total] = await this.operativoRepository.listarDetenidosPorOperativo(idOperativo, paginacion)
    const filas = detenidos.map(({ fotoFrente, fotoPerfilDerecho, fotoPerfilIzquierdo, paisNacionalidad, estadoCivil, operativo, ...d }) => ({
      ...d,
      descripcionPais: paisNacionalidad?.descripcion ?? null,
      descripcionEstadoCivil: estadoCivil?.descripcion ?? null,
      urlFotoFrente: fotoFrente?.length
        ? `/api/operativos/caso/${idCaso}/personas/${d.id}/fotos/frente`
        : null,
      urlFotoPerfilDerecho: fotoPerfilDerecho?.length
        ? `/api/operativos/caso/${idCaso}/personas/${d.id}/fotos/perfil-derecho`
        : null,
      urlFotoPerfilIzquierdo: fotoPerfilIzquierdo?.length
        ? `/api/operativos/caso/${idCaso}/personas/${d.id}/fotos/perfil-izquierdo`
        : null,
    }))
    return [filas, total]
  }

  async eliminarDetenido(idCaso: string, idDetenido: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarDetenido(idDetenido)
  }

  // ==================== GALERÍA ====================

  async agregarFotoGaleria(
    idCaso: string,
    data: CreateGaleriaDto,
    foto: Buffer,
    usuario: string
  ): Promise<Galeria> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const galeria = new Galeria({ idOperativo, descripcion: data.descripcion, foto })
    return this.operativoRepository.crearGaleria(galeria)
  }

  async listarGaleria(idCaso: string, paginacion: PaginacionQueryDto): Promise<[Galeria[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    return this.operativoRepository.listarGaleriaPorOperativo(idOperativo, paginacion)
  }

  async eliminarFotoGaleria(idCaso: string, idGaleria: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
    await this.operativoRepository.eliminarGaleria(idGaleria)
  }

  // ==================== LOGOTIPOS ====================

  async agregarLogotipo(
    idCaso: string,
    data: CreateLogotipoDto,
    fotografia: Buffer,
    usuario: string
  ): Promise<any> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const operativo = await this.buscarPorId(idOperativo)
    const asignacion = await this.asignacionSiiiRepository.buscarPorId(idCaso)

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
        ? `/api/operativos/caso/${idCaso}/logotipos/${logotipo.id}/foto`
        : null,
    }
  }

  async listarLogotipos(idCaso: string, paginacion: PaginacionQueryDto): Promise<[any[], number]> {
    const idOperativo = await this.resolverIdOperativoOpcional(idCaso)
    if (!idOperativo) return [[], 0]
    const [logotipos, total] = await this.operativoRepository.listarLogotiposPorOperativo(idOperativo, paginacion)
    const filas = logotipos.map(({ fotografia, tipoDroga, paisOrigen, paisDestino, operativo, ...l }) => ({
      ...l,
      descripcionTipoDroga: tipoDroga?.descripcion ?? null,
      descripcionPaisOrigen: paisOrigen?.descripcion ?? null,
      descripcionPaisDestino: paisDestino?.descripcion ?? null,
      urlFotografia: fotografia?.length
        ? `/api/operativos/caso/${idCaso}/logotipos/${l.id}/foto`
        : null,
    }))
    return [filas, total]
  }

  async eliminarLogotipo(idCaso: string, idLogotipo: string): Promise<void> {
    await this.resolverIdOperativo(idCaso)
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
    return this.operativoRepository.listarItemsOperativoPorCategoria(
      idCategoriaOperativo
    )
  }

  async listarCatalogoClases(idBien: number) {
    return this.operativoRepository.listarCatalogoClasesPorBien(idBien)
  }

  async listarCatalogoTipos(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoTiposPorClase(idCatalogoClase)
  }

  async listarCatalogoCaracteristicas(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoCaracteristicasPorClase(
      idCatalogoClase
    )
  }

  // ==================== CASOS DE USUARIO ====================

  async listarCasosPorUsuario(usuario: string): Promise<any[]> {
    return this.asignacionSiiiRepository.buscarTodosPorUsuario(usuario)
  }

  async listarCasosNoAprobados(usuario: string): Promise<any[]> {
    return this.asignacionSiiiRepository.buscarNoAprobadosPorUsuario(usuario)
  }

  // ==================== IMÁGENES (LAZY LOADING) ====================

  async obtenerFotoGaleria(idCaso: string, idFoto: string): Promise<Buffer> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const galeria = await this.operativoRepository.buscarGaleriaPorId(idFoto)
    if (!galeria) {
      throw new NotFoundException(`Foto de galería con ID ${idFoto} no encontrada`)
    }
    if (galeria.idOperativo !== idOperativo) {
      throw new NotFoundException(
        `La foto ${idFoto} no pertenece al operativo del caso ${idCaso}`
      )
    }
    return galeria.foto
  }

  async obtenerFotoDetenido(
    idCaso: string,
    idDetenido: string,
    tipo: 'frente' | 'perfil-derecho' | 'perfil-izquierdo'
  ): Promise<Buffer> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const detenido = await this.operativoRepository.buscarDetenidoPorId(idDetenido)
    if (!detenido) {
      throw new NotFoundException(`Detenido con ID ${idDetenido} no encontrado`)
    }
    if (detenido.idOperativo !== idOperativo) {
      throw new NotFoundException(
        `El detenido ${idDetenido} no pertenece al operativo del caso ${idCaso}`
      )
    }
    switch (tipo) {
      case 'frente':
        return detenido.fotoFrente || Buffer.alloc(0)
      case 'perfil-derecho':
        return detenido.fotoPerfilDerecho || Buffer.alloc(0)
      case 'perfil-izquierdo':
        return detenido.fotoPerfilIzquierdo || Buffer.alloc(0)
      default:
        throw new NotFoundException(`Tipo de foto "${tipo}" no válido`)
    }
  }

  async obtenerFotoBien(idCaso: string, idBien: string): Promise<Buffer> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const bien = await this.operativoRepository.buscarBienPorId(idBien)
    if (!bien) {
      throw new NotFoundException(`Bien con ID ${idBien} no encontrado`)
    }
    if (bien.idOperativo !== idOperativo) {
      throw new NotFoundException(
        `El bien ${idBien} no pertenece al operativo del caso ${idCaso}`
      )
    }
    return bien.fotoBien || Buffer.alloc(0)
  }

  async obtenerFotoLogotipo(idCaso: string, idLogotipo: string): Promise<Buffer> {
    const idOperativo = await this.resolverIdOperativo(idCaso)
    const logotipo = await this.operativoRepository.buscarLogotipoPorId(idLogotipo)
    if (!logotipo) {
      throw new NotFoundException(`Logotipo con ID ${idLogotipo} no encontrado`)
    }
    if (logotipo.idOperativo !== idOperativo) {
      throw new NotFoundException(
        `El logotipo ${idLogotipo} no pertenece al operativo del caso ${idCaso}`
      )
    }
    return logotipo.fotografia || Buffer.alloc(0)
  }
}
