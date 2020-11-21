import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Photo } from './photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoDto } from './photo.dto';
import { AlbumService } from 'src/album/album.service';
import { Album } from 'src/album/album.entity';
import fs = require('fs');
import path = require('path');
import * as Mkdirp from  'mkdirp';
import * as Sharp from 'sharp';
import {ExifParserFactory} from 'ts-exif-parser';
import { FaceService } from 'src/face/face.service';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        @Inject(forwardRef(() => AlbumService))
        private albumService: AlbumService,
        @Inject(forwardRef(() => FaceService))
        private faceService: FaceService
    ) {}

    async create(photo: Photo, photoDto: PhotoDto): Promise<Photo> {
        if (photoDto.title)
            photo.title = photoDto.title;
        if (photoDto.description)
            photo.description = photoDto.description;
        if (photoDto.idAlbum){
            const album: Album = await this.albumService.findOne(''+photoDto.idAlbum);
            photo.albums = [album];
        }
        return this.photoRepository.save(photo);
    }

    async uploadPhoto(files, photoDto: PhotoDto){
        // console.log(files[0]);
        const image = Sharp(files[0].buffer);
        const metadata = await image.metadata();
        // console.log(metadata)
        
        const photo = new Photo();
        photo.title = files[0].originalname;
        photo.originalFileName = files[0].originalname;
        photo.height = metadata.height;
        photo.width = metadata.width;
        photo.weight = metadata.size;
        if (metadata.exif){
            const exifData = ExifParserFactory.create(files[0].buffer).parse();
            // console.log("Exif Data:");
            // console.log(exifData);
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
        let newPhoto = await this.create(photo,photoDto);
        // console.log(newPhoto);
        const upFolder = path.join(__dirname, '..', '..', 'files'); 
        const imagePath = '/' + newPhoto.shootDate.getFullYear() + '/' + (newPhoto.shootDate.getMonth() + 1) + '/' + newPhoto.shootDate.getDate();
        await Mkdirp.sync(path.join(upFolder,imagePath));
        const srcOrig = imagePath + '/' + newPhoto.idPhoto + '-' + files[0].originalname;
        const src150 = imagePath + '/' + newPhoto.idPhoto + '-150.webp';
        const src320 = imagePath + '/' + newPhoto.idPhoto + '-320.webp';
        const src640 = imagePath + '/' + newPhoto.idPhoto + '-640.webp';
        const src1280 = imagePath + '/' + newPhoto.idPhoto + '-1280.webp';
        const src1920 = imagePath + '/' + newPhoto.idPhoto + '-1920.webp';
        // console.log(upFolder);
        // console.log(path.join(upFolder, srcOrig));
        await image.withMetadata().toFile(path.join(upFolder, srcOrig));
        await image.resize(150, 150).webp().rotate().toFile(path.join(upFolder, src150));
        newPhoto.srcOrig = srcOrig;
        newPhoto.src150 = src150;
        if (newPhoto.height > 320 || newPhoto.width > 320){
            await image.resize(320, 160, {fit: 'inside'}).webp().rotate().toFile(path.join(upFolder, src320));
            newPhoto.src320 = src320;
        }
        if (newPhoto.height > 640 || newPhoto.width > 640){
            await image.resize(640, 320, {fit: 'inside'}).webp().rotate().toFile(path.join(upFolder, src640));
            newPhoto.src640 = src640;
        }
        if (newPhoto.height > 1280 || newPhoto.width > 1280){
            await image.resize(1280, 720, {fit: 'inside'}).webp().rotate().toFile(path.join(upFolder, src1280));
            newPhoto.src1280 = src1280;
        }
        if (newPhoto.height > 1920 || newPhoto.width > 1920){
            await image.resize(1920, 1080, {fit: 'inside'}).webp().rotate().toFile(path.join(upFolder, src1920));
            newPhoto.src1920 = src1920;
        }
        newPhoto = await this.photoRepository.save(newPhoto);
        const facesToTag = await this.faceService.detectFaces(srcOrig,newPhoto.idPhoto);
        newPhoto = await this.photoRepository.findOne(newPhoto.idPhoto);
        newPhoto.facesToTag = facesToTag;
        return await this.photoRepository.save(newPhoto);
    }

    findOne(id: string): Promise<Photo> {
        return this.photoRepository.findOne(id);
    }

    save(photo: Photo){
        return this.photoRepository.save(photo);
    }

    async update(id: string, photoDto: PhotoDto): Promise<Photo> {
        const photoSrc: Photo = await this.photoRepository.findOne(id);
        if (photoDto.shootDate && (photoDto.shootDate.getFullYear() !== photoSrc.shootDate.getFullYear() ||
        photoDto.shootDate.getMonth() !== photoSrc.shootDate.getMonth() || 
        photoDto.shootDate.getDay() !== photoSrc.shootDate.getDay())){
            const imagePath = '/' + photoDto.shootDate.getFullYear() + '/' + (photoDto.shootDate.getMonth() + 1) + '/' + photoDto.shootDate.getDate();
            await Mkdirp.sync(path.join(__dirname,imagePath));
            const src150 = imagePath + '/' + photoSrc.idPhoto + '-150.webp';
            const src320 = imagePath + '/' + photoSrc.idPhoto + '-320.webp';
            const src640 = imagePath + '/' + photoSrc.idPhoto + '-640.webp';
            const src1280 = imagePath + '/' + photoSrc.idPhoto + '-1280.webp';
            const src1920 = imagePath + '/' + photoSrc.idPhoto + '-1920.webp';
            const srcOrig = imagePath + '/' + photoSrc.idPhoto + '-' + photoSrc.originalFileName;
            const upFolder = path.join(__dirname, '..', '..', 'files'); 
            try {
                if (photoSrc.src1920){
                    fs.renameSync(path.join(upFolder,photoSrc.src1920),path.join(upFolder,src1920));
                    photoSrc.src1920 = src1920;
                }
                if (photoSrc.src1280){
                    fs.renameSync(path.join(upFolder,photoSrc.src1280),path.join(upFolder,src1280));
                    photoSrc.src1280 = src1280;
                }
                if (photoSrc.src640){
                    fs.renameSync(path.join(upFolder,photoSrc.src640),path.join(upFolder,src640));
                    photoSrc.src640 = src640;
                }
                if (photoSrc.src320){
                    fs.renameSync(path.join(upFolder,photoSrc.src320),path.join(upFolder,src320));
                    photoSrc.src320 = src320;
                }
                fs.renameSync(path.join(upFolder,photoSrc.src150),path.join(upFolder,src150));
                photoSrc.src150 = src150;
                fs.renameSync(path.join(upFolder,photoSrc.srcOrig),path.join(upFolder,srcOrig));
                photoSrc.srcOrig = srcOrig;             
            } catch(err) {
                console.error(err)
            }
        }
        return await this.photoRepository.save({...photoSrc, ...photoDto});
    }
    
    async remove(id: string): Promise<void> {  
        const photoToDelete: Photo = await this.photoRepository.findOne(id);
        await this.albumService.deleteCoverPhotosFromAlbum(id);
        const upFolder = path.join(__dirname, '..', '..', 'files'); 
        try {
            if (photoToDelete.src1920)
                fs.unlinkSync(path.join(upFolder,photoToDelete.src1920));
            if (photoToDelete.src1280)
                fs.unlinkSync(path.join(upFolder,photoToDelete.src1280));
            if (photoToDelete.src640)
                fs.unlinkSync(path.join(upFolder,photoToDelete.src640));
            if (photoToDelete.src320)
                fs.unlinkSync(path.join(upFolder,photoToDelete.src320));
            fs.unlinkSync(path.join(upFolder,photoToDelete.src150));
            fs.unlinkSync(path.join(upFolder,photoToDelete.srcOrig));            
        } catch(err) {
            console.error(err);
        }
        await this.photoRepository.delete(id);
    }
      
}
