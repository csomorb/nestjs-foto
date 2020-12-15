import { Controller, Post, UseInterceptors, UploadedFiles, Body, Delete, Param, Put, Get } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { Photo } from './photo.entity';
import { PhotoDto } from './photo.dto';


@Controller('photos')
export class PhotoController {
    constructor(private photoService: PhotoService) {}

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor())
    uploadFile(@UploadedFiles() files,@Body() photoDto: PhotoDto) {
        return this.photoService.uploadPhoto(files,photoDto);
    }

    @Put(':id')
    update(@Body() photoDto: PhotoDto, @Param('id') id): Promise<Photo> {
     return this.photoService.update(id, photoDto);
    }

    @Put(':id/rotate-left')
    rotateLeft(@Param('id') id): Promise<Photo> {
     return this.photoService.rotateLeft(id);
    }

    @Put(':id/rotate-right')
    rotateRight(@Param('id') id): Promise<Photo> {
     return this.photoService.rotateRight(id);
    }

    @Get(':id')
    findPhoto(@Param('id') id: string): Promise<Photo> {
        return this.photoService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.photoService.remove(id);
    }

    @Put(':idPhoto/move-to-album/:idAlbum')
    moveToAlbum(@Param('idPhoto') idPhoto,  @Param('idAlbum') idAlbum): Promise<Photo> {
     return this.photoService.moveToAlbum(idPhoto, idAlbum);
    }

    @Put(':idPhoto/copy-to-album/:idAlbum')
    copyToAlbum(@Param('idPhoto') idPhoto,  @Param('idAlbum') idAlbum): Promise<Photo> {
     return this.photoService.copyToAlbum(idPhoto, idAlbum);
    }

    @Put(':idPhoto/tags/:idTag')
    addTag(@Param('idPhoto') idPhoto,  @Param('idTag') idTag): Promise<Photo> {
     return this.photoService.addTag(idPhoto, idTag);
    }

    @Delete(':idPhoto/tags/:idTag')
    deleteTag(@Param('idPhoto') idPhoto,  @Param('idTag') idTag): Promise<Photo> {
     return this.photoService.deleteTag(idPhoto, idTag);
    }

}
