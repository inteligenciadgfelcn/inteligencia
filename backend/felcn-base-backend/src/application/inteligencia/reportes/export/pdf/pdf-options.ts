import { PDFOptions } from 'puppeteer'

export type TamanioPDF =
  | 'Letter'
  | 'Legal'
  | 'Tabloid'
  | 'Ledger'
  | 'A0'
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'Oficio'

export type OrientacionPDF = 'vertical' | 'horizontal'

export interface ConfiguracionPDF {
  tamanio?: TamanioPDF
  orientacion?: OrientacionPDF
  margenSuperior?: string
  margenInferior?: string
  margenIzquierdo?: string
  margenDerecho?: string
  escala?: number
  preferirTamanioCSS?: boolean
}

export function crearOpcionesPDF(
  configuracion: ConfiguracionPDF = {}
): PDFOptions {
  const {
    tamanio = 'Letter',
    orientacion = 'vertical',
    margenSuperior = '12mm',
    margenInferior = '12mm',
    margenIzquierdo = '12mm',
    margenDerecho = '12mm',
    escala = 1,

    preferirTamanioCSS = false,
  } = configuracion

  const landscape = orientacion === 'horizontal'

  const opcionesComunes: PDFOptions = {
    landscape,
    printBackground: true,
    preferCSSPageSize: preferirTamanioCSS,
    scale: escala,
    margin: {
      top: margenSuperior,
      bottom: margenInferior,
      left: margenIzquierdo,
      right: margenDerecho,
    },
  }

  if (tamanio === 'Oficio') {
    return {
      ...opcionesComunes,
      width: '216mm',
      height: '330mm',
    }
  }

  return {
    ...opcionesComunes,
    format: tamanio,
  }
}

export const PDF_CARTA_VERTICAL = crearOpcionesPDF({
  tamanio: 'Letter',

  orientacion: 'vertical',
})

export const PDF_CARTA_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'Letter',

  orientacion: 'horizontal',
})

export const PDF_LEGAL_VERTICAL = crearOpcionesPDF({
  tamanio: 'Legal',

  orientacion: 'vertical',
})

export const PDF_LEGAL_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'Legal',

  orientacion: 'horizontal',
})

export const PDF_OFICIO_VERTICAL = crearOpcionesPDF({
  tamanio: 'Oficio',

  orientacion: 'vertical',

  margenSuperior: '0mm',

  margenInferior: '0mm',

  margenIzquierdo: '0mm',

  margenDerecho: '0mm',

  preferirTamanioCSS: true,
})

export const PDF_OFICIO_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'Oficio',

  orientacion: 'horizontal',

  margenSuperior: '8mm',

  margenInferior: '8mm',

  margenIzquierdo: '8mm',

  margenDerecho: '8mm',
})

export const PDF_A4_VERTICAL = crearOpcionesPDF({
  tamanio: 'A4',

  orientacion: 'vertical',
})

export const PDF_A4_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'A4',

  orientacion: 'horizontal',
})

export const PDF_A3_VERTICAL = crearOpcionesPDF({
  tamanio: 'A3',

  orientacion: 'vertical',

  margenSuperior: '8mm',

  margenInferior: '8mm',

  margenIzquierdo: '8mm',

  margenDerecho: '8mm',
})

export const PDF_A3_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'A3',

  orientacion: 'horizontal',

  margenSuperior: '8mm',

  margenInferior: '8mm',

  margenIzquierdo: '8mm',

  margenDerecho: '8mm',
})

export const PDF_TABLOID_VERTICAL = crearOpcionesPDF({
  tamanio: 'Tabloid',

  orientacion: 'vertical',
})

export const PDF_TABLOID_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'Tabloid',

  orientacion: 'horizontal',
})

export const PDF_LEDGER_VERTICAL = crearOpcionesPDF({
  tamanio: 'Ledger',

  orientacion: 'vertical',
})

export const PDF_LEDGER_HORIZONTAL = crearOpcionesPDF({
  tamanio: 'Ledger',

  orientacion: 'horizontal',
})
