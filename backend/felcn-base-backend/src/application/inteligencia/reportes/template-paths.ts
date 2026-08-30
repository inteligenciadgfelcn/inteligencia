import * as path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const TemplatePaths = {
  pdfTemplates: isProduction
    ? path.resolve(__dirname, '../../application/inteligencia/reportes/pdf/templates')
    : path.resolve(process.cwd(), 'src/application/inteligencia/reportes/pdf/templates'),
};