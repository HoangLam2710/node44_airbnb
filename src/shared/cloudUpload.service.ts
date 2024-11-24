import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudUploadService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          { folder },
          (error: any, result: UploadApiResponse) => {
            if (result) {
              resolve(result.url);
            } else {
              reject(error);
            }
          },
        );
        uploadStream.end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);
    return images;
  }
}
