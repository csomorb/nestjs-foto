import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body, Delete, Param, Put, Get } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { Photo } from './photo.entity';
import * as Sharp from 'sharp';
import {ExifParserFactory} from 'ts-exif-parser';
import * as Mkdirp from  'mkdirp';
import { PhotoDto } from './photo.dto';
import path = require('path');


@Controller('photos')
export class PhotoController {
    constructor(private photoService: PhotoService) {}

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor())
    async uploadFile(@UploadedFiles() files,@Body() photoDto: PhotoDto) {
        const that = this;

        for (const file of files) {
            console.log(file);
            const image = Sharp(file.buffer);
            const metadata = await image.metadata();
            console.log(metadata)
            
            const photo = new Photo();
            photo.title = file.originalname;
            photo.originalFileName = file.originalname;
            photo.height = metadata.height;
            photo.width = metadata.width;
            photo.weight = metadata.size;
            if (metadata.exif){
                const exifData = ExifParserFactory.create(file.buffer).parse();
                console.log(exifData);
                if (exifData.tags.GPSAltitude)
                    photo.alti = parseInt(exifData.tags.GPSAltitude.toFixed(1));
                if (exifData.tags.GPSLatitude)
                    photo.lat = Number(exifData.tags.GPSLatitude.toFixed(8));
                if (exifData.tags.GPSLongitude)
                    photo.long = Number(exifData.tags.GPSLongitude.toFixed(8));
                if (exifData.tags.DateTimeOriginal)  
                    photo.shootDate = new Date(exifData.tags.DateTimeOriginal * 1000);
                else if(exifData.tags.CreateDate)
                    photo.shootDate = new Date(exifData.tags.CreateDate * 1000); 
            }
            if (!photo.shootDate){
                photo.shootDate = new Date();
            }
            const newPhoto = await that.photoService.create(photo,photoDto);
            console.log(newPhoto);
            const imagePath = '/upload/' + newPhoto.shootDate.getFullYear() + '/' + (newPhoto.shootDate.getMonth() + 1) + '/' + newPhoto.shootDate.getDate();
            await Mkdirp.sync(path.join(__dirname,imagePath));
            const srcOrig = imagePath + '/' + newPhoto.idPhoto + '-' + file.originalname;
            const src150 = imagePath + '/' + newPhoto.idPhoto + '-150.webp';
            const src320 = imagePath + '/' + newPhoto.idPhoto + '-320.webp';
            const src640 = imagePath + '/' + newPhoto.idPhoto + '-640.webp';
            const src1280 = imagePath + '/' + newPhoto.idPhoto + '-1280.webp';
            console.log(__dirname);
            image.toFile(path.join(__dirname, srcOrig));
            image.resize(150, 150).webp().toFile(path.join(__dirname, src150));
            newPhoto.srcOrig = srcOrig;
            newPhoto.src150 = src150;
            if (newPhoto.height > 320 || newPhoto.width > 320){
                image.resize(320, 160, {fit: 'inside'}).webp().toFile(path.join(__dirname, src320));
                newPhoto.src320 = src320;
            }
            if (newPhoto.height > 640 || newPhoto.width > 640){
                image.resize(640, 320, {fit: 'inside'}).webp().toFile(path.join(__dirname, src640));
                newPhoto.src640 = src640;
            }
            if (newPhoto.height > 1280 || newPhoto.width > 1280){
                image.resize(1280, 720, {fit: 'inside'}).webp().toFile(path.join(__dirname, src1280));
                newPhoto.src1280 = src1280;
            }
            return await that.photoService.update(''+newPhoto.idPhoto,newPhoto);
        }
    }

    @Put(':id')
    update(@Body() photoDto: PhotoDto, @Param('id') id): Promise<Photo> {
     return this.photoService.update(id, photoDto);
    }

    @Get(':id')
    findPhoto(@Param('id') id: string): Promise<Photo> {
        return this.photoService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.photoService.remove(id);
    }

}
