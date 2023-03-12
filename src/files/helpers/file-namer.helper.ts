import * as uuid from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error, fileName: string) => void,
) => {
  const [, extension] = file.mimetype.split('/');
  const fileName = `${uuid.v4()}.${extension}`;
  callback(null, fileName);
};
