import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FotoService } from './foto.service';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { Foto } from './foto.entity';
import * as Sharp from 'sharp';
import {ExifParserFactory} from 'ts-exif-parser';
import * as Mkdirp from  'mkdirp';


@Controller('fotos')
export class FotoController {
    constructor(private fotoService: FotoService) {}

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFile(@UploadedFiles() files) {
        let that = this;

        for (const file of files) {
            console.log(file);
            const image = Sharp(file.buffer);
            let metadata = await image.metadata();
            console.log(metadata)
            
            const foto = new Foto();
            foto.title = file.originalname;
            foto.height = metadata.height;
            foto.width = metadata.width;
            foto.weight = metadata.size;
            if (metadata.exif){
                const exifData = ExifParserFactory.create(file.buffer).parse();
                console.log(exifData);
                if (exifData.tags.GPSAltitude)
                    foto.alti = parseInt(exifData.tags.GPSAltitude.toFixed(1));
                if (exifData.tags.GPSLatitude)
                    foto.lat = Number(exifData.tags.GPSLatitude.toFixed(8));
                if (exifData.tags.GPSLongitude)
                    foto.long = Number(exifData.tags.GPSLongitude.toFixed(8));
                if (exifData.tags.DateTimeOriginal)  
                    foto.shootDate = new Date(exifData.tags.DateTimeOriginal * 1000);
                else if(exifData.tags.CreateDate)
                    foto.shootDate = new Date(exifData.tags.CreateDate * 1000); 
            }
            if (!foto.shootDate){
                foto.shootDate = new Date();
            }
            const newFoto = await that.fotoService.create(foto);
            console.log(newFoto);
            let imagePath = './upload/' + newFoto.shootDate.getFullYear() + '/' + newFoto.shootDate.getMonth() + '/' + newFoto.shootDate.getDay();
            const made = await Mkdirp.sync(imagePath);
            let srcOrig = imagePath + '/' + newFoto.idFoto + '-' + newFoto.title;
            let src150 = imagePath + '/' + newFoto.idFoto + '-150.webp';
            image.toFile(srcOrig);
            image.resize(150, 150).webp().toFile(src150);
            newFoto.srcOrig = srcOrig;
            newFoto.src150 = src150;
            await that.fotoService.update(''+newFoto.idFoto,newFoto);
        }
    }

}
