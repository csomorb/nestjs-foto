import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleDto } from './people.dto';
import { People } from './people.entity';

@Controller('peoples')
export class PeopleController {
    constructor(private peopleService: PeopleService) {}

    @Post()
    create(@Body() peopleDto: PeopleDto): Promise<People> {
      return this.peopleService.create(peopleDto);
    }

    @Get()
    findAll(): Promise<People[]>  {
    return this.peopleService.findAll();
    }

    @Get(':id')
    findPeople(@Param('id') id: string): Promise<People> {
        return this.peopleService.findOne(id);
    }

    @Get(':id/photos')
    findPeopleWithPhotos(@Param('id') id: string): Promise<People> {
        return this.peopleService.findPeopleWithPhotos(id);
    }

    @Put(':id')
    update(@Body() peopleDto: PeopleDto, @Param('id') id): Promise<People> {
     return this.peopleService.update(id, peopleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.peopleService.remove(id);
    }
}
