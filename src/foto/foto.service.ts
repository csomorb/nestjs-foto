import { Injectable } from '@nestjs/common';
import { Foto } from './foto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FotoDto } from './foto.dto';
import { AlbumService } from 'src/album/album.service';
import { Album } from 'src/album/album.entity';

@Injectable()
export class FotoService {
    constructor(
        @InjectRepository(Foto)
        private fotoRepository: Repository<Foto>,
        private albumService: AlbumService
    ) {}

    async create(foto: Foto, fotoDto: FotoDto): Promise<Foto> {
        if (fotoDto.title)
            foto.title = fotoDto.title;
        if (fotoDto.description)
            foto.description = fotoDto.description;
        if (fotoDto.idAlbum){
            const album: Album = await this.albumService.findOne(''+fotoDto.idAlbum);
            foto.albums = [album];
        }
        return this.fotoRepository.save(foto);
    }

    findOne(id: string): Promise<Foto> {
        return this.fotoRepository.findOne(id);
    }

    async update(id: string, foto: Foto): Promise<Foto> {
        let fotoSrc: Foto = await this.fotoRepository.findOne(id);
        return await this.fotoRepository.save({...fotoSrc, ...foto});
    }
    
    async remove(id: string): Promise<void> {    
        await this.fotoRepository.delete(id);
    }
      
}
