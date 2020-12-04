import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { AlbumDto } from './album.dto';

@Controller('albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Post()
    create(@Body() albumDto: AlbumDto): Promise<Album> {
      return this.albumService.create(albumDto);
    }

    @Get()
    findAll(): Promise<Album[]>  {
    //return this.albumService.findAll();
        return this.albumService.findAlbumTree();
    }

    @Get('roots')
    findRoots(): Promise<Album[]>  {
        return this.albumService.findRootAlbums();
    }

    @Get('covers')
    findCovers(): Promise<Album[]>  {
        return this.albumService.findAll();
    }
    

    @Get('photos-child/:limit')
    findRootsWithChildPhotos(@Param('limit') limit: string): Promise<Album[]> {
        return this.albumService.findRootsWithChildrenPhotos(limit);
    }

    @Get(':id')
    findAlbum(@Param('id') id: string): Promise<Album> {
        return this.albumService.findOne(id);
    }

    @Get(':id/photos')
    findAlbumWithPhotos(@Param('id') id: string): Promise<Album> {
        return this.albumService.findAlbumWithPhotos(id);
    }

    @Get(':id/photos-child/:limit')
    findAlbumWithChildPhotos(@Param('id') id: string,@Param('limit') limit: string): Promise<Album[]> {
        return this.albumService.findAlbumWithChildrenPhotos(id,limit);
    }

    @Get(':id/childrens')
    findAlbumChildrens(@Param('id') id: string): Promise<Album[]> {
        return this.albumService.findChildrens(id);
    }

    @Get(':id/childrens-tree')
    findAlbumChildrensTree(@Param('id') id: string): Promise<Album> {
        return this.albumService.findChildrensTree(id);
    }

    @Get(':id/parents')
    findAlbumParents(@Param('id') id: string): Promise<Album[]> {
        return this.albumService.findParents(id);
    }

    @Get(':id/parents-tree')
    findAlbumParentsTree(@Param('id') id: string): Promise<Album> {
        return this.albumService.findParentsTree(id);
    }

    @Post(':idAlbum/cover/:idPhoto')
    createCover(@Param('idAlbum') idAlbum: string, @Param('idPhoto') idPhoto: string ): Promise<Album> {
      return this.albumService.setCover(idAlbum,idPhoto);
    }

    @Put(':idAlbum/cover/:idPhoto')
    updateCover(@Param('idAlbum') idAlbum: string, @Param('idPhoto') idPhoto: string ): Promise<Album> {
      return this.albumService.setCover(idAlbum,idPhoto);
    }

    @Put(':id')
    update(@Body() albumDto: AlbumDto, @Param('id') id): Promise<Album> {
     return this.albumService.update(id, albumDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        let v;
        try {
            v = await this.albumService.remove(id);
        } catch(e) { //TODO: gérer les autres erreurs ! 
            if (e.code === 'ER_ROW_IS_REFERENCED_2'){
                throw new HttpException({
                    status: HttpStatus.FAILED_DEPENDENCY,
                    error: 'Supprimez d abord les sous albums',
                  }, HttpStatus.FAILED_DEPENDENCY);
            }
            if (e.code === 'ALBUM_NOT_EMPTY'){
                throw new HttpException({
                    status: HttpStatus.FAILED_DEPENDENCY,
                    error: e.message,
                  }, HttpStatus.FAILED_DEPENDENCY);
            }
            throw e;
        }
        return v;
    }
}
