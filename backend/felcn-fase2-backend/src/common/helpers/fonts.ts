import * as path from 'path';

export const pdfFonts = {
  Arial: {
    normal: path.join(__dirname, '../../assets/fonts/Arial.ttf'),
    bold: path.join(__dirname, '../../assets/fonts/Arial_Bold.ttf'),
    italics: path.join(__dirname, '../../assets/fonts/Arial_Italic.ttf'),
    bolditalics: path.join(
      __dirname,
      '../../assets/fonts/Arial_Bold_Italic.ttf',
    ),
  },
};
