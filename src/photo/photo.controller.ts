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

    @Get(':id')
    findPhoto(@Param('id') id: string): Promise<Photo> {
        return this.photoService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.photoService.remove(id);
    }

}
