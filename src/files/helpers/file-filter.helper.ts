import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) {
    const error = new BadRequestException('Did not send any file');
    return callback(error, false);
  }

  const [, extension] = file.mimetype.split('/');

  const validExtensions = ['png', 'jpg', 'jpeg', 'svg'];

  const isValid = validExtensions.includes(extension);

  if (!isValid) {
    const error = new BadRequestException('The file has a not valid extension');
    return callback(error, false);
  }

  callback(null, true);
};
