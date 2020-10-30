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

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        @Inject(forwardRef(() => AlbumService))
        private albumService: AlbumService
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

    findOne(id: string): Promise<Photo> {
        return this.photoRepository.findOne(id);
    }

    async update(id: string, photoDto: PhotoDto): Promise<Photo> {
        const photoSrc: Photo = await this.photoRepository.findOne(id);
        if (photoDto.shootDate && photoDto.shootDate !== photoSrc.shootDate){
            const imagePath = '/upload/' + photoDto.shootDate.getFullYear() + '/' + (photoDto.shootDate.getMonth() + 1) + '/' + photoDto.shootDate.getDate();
            await Mkdirp.sync(path.join(__dirname,imagePath));
            const src150 = imagePath + '/' + photoSrc.idPhoto + '-150.webp';
            const src320 = imagePath + '/' + photoSrc.idPhoto + '-320.webp';
            const src640 = imagePath + '/' + photoSrc.idPhoto + '-640.webp';
            const src1280 = imagePath + '/' + photoSrc.idPhoto + '-1280.webp';
            const src1920 = imagePath + '/' + photoSrc.idPhoto + '-1920.webp';
            const srcOrig = imagePath + '/' + photoSrc.idPhoto + '-' + photoSrc.originalFileName;
            try {
                if (photoSrc.src1920){
                    fs.renameSync(path.join(__dirname,photoSrc.src1920),path.join(__dirname,src1920));
                    photoSrc.src1920 = src1920;
                }
                if (photoSrc.src1280){
                    fs.renameSync(path.join(__dirname,photoSrc.src1280),path.join(__dirname,src1280));
                    photoSrc.src1280 = src1280;
                }
                if (photoSrc.src640){
                    fs.renameSync(path.join(__dirname,photoSrc.src640),path.join(__dirname,src640));
                    photoSrc.src640 = src640;
                }
                if (photoSrc.src320){
                    fs.renameSync(path.join(__dirname,photoSrc.src320),path.join(__dirname,src320));
                    photoSrc.src320 = src320;
                }
                fs.renameSync(path.join(__dirname,photoSrc.src150),path.join(__dirname,src150));
                photoSrc.src150 = src150;
                fs.renameSync(path.join(__dirname,photoSrc.srcOrig),path.join(__dirname,srcOrig));
                photoSrc.srcOrig = srcOrig;             
            } catch(err) {
                console.error(err)
            }
        }
        

        return await this.photoRepository.save({...photoSrc, ...photoDto});
    }
    
    async remove(id: string): Promise<void> {  
        const photoToDelete: Photo = await this.photoRepository.findOne(id);
        try {
            if (photoToDelete.src1920)
                fs.unlinkSync(path.join(__dirname,photoToDelete.src1920));
            if (photoToDelete.src1280)
                fs.unlinkSync(path.join(__dirname,photoToDelete.src1280));
            if (photoToDelete.src640)
                fs.unlinkSync(path.join(__dirname,photoToDelete.src640));
            if (photoToDelete.src320)
                fs.unlinkSync(path.join(__dirname,photoToDelete.src320));
            fs.unlinkSync(path.join(__dirname,photoToDelete.src150));
            fs.unlinkSync(path.join(__dirname,photoToDelete.srcOrig));            
        } catch(err) {
            console.error(err);
        }
        await this.photoRepository.delete(id);
    }
      
}
