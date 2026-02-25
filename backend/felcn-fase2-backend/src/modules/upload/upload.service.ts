import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface FileWithPath extends Express.Multer.File {
  path: string;
  originalname: string;
}

@Injectable()
export class UploadService {
  saveFileInfo(type: 'images' | 'pdfs', id: string, file: FileWithPath) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', type);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const newFilename = `${id}${ext}`;
    const newPath = path.join(uploadDir, newFilename);

    fs.renameSync(file.path, newPath);

    return {
      filename: newFilename,
      path: `/uploads/${type}/${newFilename}`,
    };
  }
}
