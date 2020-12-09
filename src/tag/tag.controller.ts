import { Controller, Post, Body, Get, Param, Put, Delete, Res } from '@nestjs/common';
import { TagService } from './tag.service';
import { DownloadTagDto, TagDto } from './tag.dto';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagController {
    constructor(private tagService: TagService) {}

    @Post()
    create(@Body() tagDto: TagDto): Promise<Tag> {
      return this.tagService.create(tagDto);
    }

    @Get()
    findAll(): Promise<Tag[]>  {
    return this.tagService.findAll();
    }

    @Get(':id')
    findTag(@Param('id') id: string): Promise<Tag> {
        return this.tagService.findOne(id);
    }

    @Get(':id/photos')
    findTagWithPhotos(@Param('id') id: string): Promise<Tag> {
        return this.tagService.findTagWithPhotos(id);
    }

    @Get(':id/download')
    async download(@Param('id') id: string, @Res() res): Promise<any> {
        const zip = await this.tagService.download(id);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }

    @Put(':id/download')
    async downloadItems(@Param('id') id: string, @Res() res, @Body() items: DownloadTagDto): Promise<any> {
        const zip = await this.tagService.downloadItems(id,items);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }

    @Put(':id')
    update(@Body() tagDto: TagDto, @Param('id') id): Promise<Tag> {
     return this.tagService.update(id, tagDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tagService.remove(id);
    }

    @Put(':idTag/cover/:idPhoto')
    updateCover(@Param('idTag') idTag: string, @Param('idPhoto') idPhoto: string ): Promise<Tag> {
      return this.tagService.setCover(idTag,idPhoto);
    }
}
