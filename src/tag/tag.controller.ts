import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './tag.dto';
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

    @Get(':id/fotos')
    findTagWithFotos(@Param('id') id: string): Promise<Tag> {
        return this.tagService.findTagWithFotos(id);
    }

    @Put(':id')
    update(@Body() tagDto: TagDto, @Param('id') id): Promise<Tag> {
     return this.tagService.update(id, tagDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tagService.remove(id);
    }
}
