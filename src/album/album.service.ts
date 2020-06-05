import { Injectable } from '@nestjs/common';
import { Album } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { AlbumDto } from './album.dto';
import { ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  findAll(): Promise<Album[]> {
    return this.albumRepository.find({ relations: ["coverPhoto"] });
  }

  findOne(id: string): Promise<Album> {
    return this.albumRepository.findOne(id,{ relations: ["coverPhoto"] });
  }

  findAlbumWithPhotos(id: string): Promise<Album> {
    return this.albumRepository.findOne(id, { relations: ["photos", "coverPhoto"] });
  }

  async findAlbumTree(){
    const manager = getManager();
    const trees = await manager.getTreeRepository(Album).findTrees();
    return trees;
  }
  

  async remove(id: string): Promise<void> {    
    await this.albumRepository.delete(id);
  }

  async update(id: string, albumDto: AlbumDto): Promise<Album> {
    const album: Album = await this.albumRepository.findOne(id);
    return await this.albumRepository.save({...album, ...albumDto});
  }

  async create(albumDto: AlbumDto): Promise<Album> {
    const album = new Album();
    album.title = albumDto.title;
    album.description = albumDto.description;
    if (albumDto.idParent){
        const albumParent = await this.albumRepository.findOne(albumDto.idParent);
        album.parent = albumParent;
    }
    return this.albumRepository.save(album);
  }

}