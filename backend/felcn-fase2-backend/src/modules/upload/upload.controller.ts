import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from './upload.service';
import * as path from 'path';

const tmpDir = path.join(__dirname, '..', '..', 'uploads', 'tmp');
import * as fs from 'fs';

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: tmpDir,
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
      },
    }),
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.saveFileInfo('images', id, file);
  }

  @Post('pdf/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: tmpDir,
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, ext === '.pdf');
      },
    }),
  )
  uploadPdf(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.saveFileInfo('pdfs', id, file);
  }
}
