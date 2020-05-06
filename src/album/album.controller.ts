import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { AlbumDto } from './album.dto';

@Controller('albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Post()
    create(@Body() albumDto: AlbumDto): Promise<Album> {
        console.log(albumDto);
      return this.albumService.create(albumDto);
    }

    @Get()
    findAll(): Promise<Album[]>  {
    return this.albumService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Album> {
        return this.albumService.findOne(id);
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
            throw e;
        }
        return v;
    }
}