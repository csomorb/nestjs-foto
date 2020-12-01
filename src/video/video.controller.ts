import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { VideoDto } from './video.dto';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
    constructor(private videoService: VideoService) {}

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor())
    uploadFile(@UploadedFiles() files,@Body() videoDto: VideoDto) {
        return this.videoService.uploadVideo(files,videoDto);
    }

    @Put(':id')
    update(@Body() videoDto: VideoDto, @Param('id') id): Promise<Video> {
     return this.videoService.update(id, videoDto);
    }

    // @Put(':id/rotate-left')
    // rotateLeft(@Param('id') id): Promise<Video> {
    //  return this.videoService.rotateLeft(id);
    // }

    // @Put(':id/rotate-right')
    // rotateRight(@Param('id') id): Promise<Video> {
    //  return this.videoService.rotateRight(id);
    // }

    @Get(':id')
    findVideo(@Param('id') id: string): Promise<Video> {
        return this.videoService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.videoService.remove(id);
    }

    @Put(':idVideo/move-to-album/:idAlbum')
    moveToAlbum(@Param('idVideo') idVideo,  @Param('idAlbum') idAlbum): Promise<Video> {
     return this.videoService.moveToAlbum(idVideo, idAlbum);
    }

    @Put(':idVideo/copy-to-album/:idAlbum')
    copyToAlbum(@Param('idVideo') idVideo,  @Param('idAlbum') idAlbum): Promise<Video> {
     return this.videoService.copyToAlbum(idVideo, idAlbum);
    }
}
