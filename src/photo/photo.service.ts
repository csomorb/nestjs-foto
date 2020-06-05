import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Photo } from './photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoDto } from './photo.dto';
import { AlbumService } from 'src/album/album.service';
import { Album } from 'src/album/album.entity';

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

    async update(id: string, photo: Photo): Promise<Photo> {
        const photoSrc: Photo = await this.photoRepository.findOne(id);
        return await this.photoRepository.save({...photoSrc, ...photo});
    }
    
    async remove(id: string): Promise<void> {    
        await this.photoRepository.delete(id);
    }
      
}
