import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        fileName: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            v2.config({
                cloud_name: 'dtuxhecc7',
                api_key: '935745368559427',
                api_secret: '3lwFhgMYjvIDdSDFW-tsmlCFkFs',
            });
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            toStream(fileName.buffer).pipe(upload);
        });
    }
}