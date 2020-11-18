import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body, Delete, Param, Put, Get } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { Photo } from './photo.entity';
import * as Sharp from 'sharp';
import {ExifParserFactory} from 'ts-exif-parser';
import * as Mkdirp from  'mkdirp';
import { PhotoDto } from './photo.dto';
import path = require('path');
import { FaceService } from 'src/face/face.service';


@Controller('photos')
export class PhotoController {
    constructor(private photoService: PhotoService,private faceService: FaceService) {}

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
            const upFolder = path.join(__dirname, '..', '..', 'files'); 
            const imagePath = '/' + newPhoto.shootDate.getFullYear() + '/' + (newPhoto.shootDate.getMonth() + 1) + '/' + newPhoto.shootDate.getDate();
            await Mkdirp.sync(path.join(upFolder,imagePath));
            const srcOrig = imagePath + '/' + newPhoto.idPhoto + '-' + file.originalname;
            const src150 = imagePath + '/' + newPhoto.idPhoto + '-150.webp';
            const src320 = imagePath + '/' + newPhoto.idPhoto + '-320.webp';
            const src640 = imagePath + '/' + newPhoto.idPhoto + '-640.webp';
            const src1280 = imagePath + '/' + newPhoto.idPhoto + '-1280.webp';
            const src1920 = imagePath + '/' + newPhoto.idPhoto + '-1920.webp';
            console.log(upFolder);
            console.log(path.join(upFolder, srcOrig));
            await image.toFile(path.join(upFolder, srcOrig));
            await image.resize(150, 150).webp().toFile(path.join(upFolder, src150));
            newPhoto.srcOrig = srcOrig;
            newPhoto.src150 = src150;
            if (newPhoto.height > 320 || newPhoto.width > 320){
                await image.resize(320, 160, {fit: 'inside'}).webp().toFile(path.join(upFolder, src320));
                newPhoto.src320 = src320;
            }
            if (newPhoto.height > 640 || newPhoto.width > 640){
                await image.resize(640, 320, {fit: 'inside'}).webp().toFile(path.join(upFolder, src640));
                newPhoto.src640 = src640;
            }
            if (newPhoto.height > 1280 || newPhoto.width > 1280){
                await image.resize(1280, 720, {fit: 'inside'}).webp().toFile(path.join(upFolder, src1280));
                newPhoto.src1280 = src1280;
            }
            if (newPhoto.height > 1920 || newPhoto.width > 1920){
                await image.resize(1920, 1080, {fit: 'inside'}).webp().toFile(path.join(upFolder, src1920));
                newPhoto.src1920 = src1920;
            }
            
            newPhoto.facetag = await this.faceService.detectFaces(srcOrig);
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
