import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  @Get('product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const image = this.filesService.findOneProductImage(imageName);
    res.status(200).sendFile(image);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      limits: { fieldSize: 5000 },
      storage: diskStorage({
        destination: './static/uploads/',
        filename: fileNamer,
      }),
    }),
  )
  async create(@UploadedFile('file') file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('The file has a not valid extension');
    }

    const hostApi =
      this.configService.get('HOST_API') || 'http://localhost:3000/api';
    const secureUrl = `${hostApi}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
