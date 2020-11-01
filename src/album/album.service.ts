import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Album } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { AlbumDto } from './album.dto';
import { PhotoService } from 'src/photo/photo.service';
import { Photo } from 'src/photo/photo.entity';
import { In } from 'typeorm/find-options/operator/In';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @Inject(forwardRef(() => PhotoService))
    private photoService: PhotoService
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

  /**
   * Retourne les albums racine ie sans parent
   */
  async findRootAlbums(){
    const manager = getManager();
    const roots = await (await manager.getTreeRepository(Album).findRoots());
    const idList = roots.map(a => a.id);
    const rootAlbumswithCover = await this.albumRepository.find({ where: { id: In(idList) }, relations: ["coverPhoto"] });
    // récupérer la première photo si pas de cover
    for(let i= 0; i < rootAlbumswithCover.length; i++)
    {
      if (!rootAlbumswithCover[i].coverPhoto){
        const albumWithPhoto = await this.albumRepository.findOne(rootAlbumswithCover[i].id, {relations: ["photos" ]});
        if (albumWithPhoto.photos && albumWithPhoto.photos.length){
          rootAlbumswithCover[i].coverPhoto = albumWithPhoto.photos[0];
        }
      }
    }
    return rootAlbumswithCover;
  }

  async findChildrens(id: string){
    const parentAlbum: Album = await this.albumRepository.findOne(id);
    const manager = getManager();
    return await manager.getTreeRepository(Album).findDescendants(parentAlbum);
  }
  
  async findChildrensTree(id: string){
    const parentAlbum: Album = await this.albumRepository.findOne(id);
    const manager = getManager();
    return await manager.getTreeRepository(Album).findDescendantsTree(parentAlbum);
  }

  async findParents(id: string){
    const parentAlbum: Album = await this.albumRepository.findOne(id);
    const manager = getManager();
    return await manager.getTreeRepository(Album).findAncestors(parentAlbum);
  }
  
  async findParentsTree(id: string){
    const parentAlbum: Album = await this.albumRepository.findOne(id);
    const manager = getManager();
    return await manager.getTreeRepository(Album).findAncestorsTree(parentAlbum);
  }

  async remove(id: string):Promise<any> { 
    const albumWithPhotos = await this.findAlbumWithPhotos(id);
    if (albumWithPhotos.photos.length)
      return Promise.reject({code : 'ALBUM_NOT_EMPTY', message : 'Album is not empty'});
    return await this.albumRepository.delete(id);
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

  async setCover(idAlbum: string,idPhoto: string): Promise<Album> {
    const album: Album = await this.albumRepository.findOne(idAlbum);
    const coverPhoto: Photo = await this.photoService.findOne(idPhoto);
    album.coverPhoto = coverPhoto;
    return this.albumRepository.save(album);
  }
  
   /**
   * Supprime les photos de couverture pour une id de Photo donné
   */
  async deleteCoverPhotosFromAlbum(idCoverPhoto: string){
    const listAlbum: Album[] = await  this.albumRepository.find({ relations: ["coverPhoto"], where: { coverPhoto: idCoverPhoto } });
    for(let i = 0 ; i < listAlbum.length; i++){
      listAlbum[i].coverPhoto = null;
      await this.albumRepository.save(listAlbum[i]);
    }
  }
}