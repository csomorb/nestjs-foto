import { Controller, Post, Body, Get, Param, Put, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleDto, PeopleFaceDto } from './people.dto';
import { People } from './people.entity';

@Controller('peoples')
export class PeopleController {
    constructor(private peopleService: PeopleService) {}

    @Post()
    async create(@Body() peopleDto: PeopleDto): Promise<People> {
        let v;
        try {
            v = await this.peopleService.create(peopleDto);
        } catch(e) { //TODO: gérer les autres erreurs ! 
            console.log(e);
            if (e.code === 'ER_DUP_ENTRY'){
                throw new HttpException({
                    status: HttpStatus.FAILED_DEPENDENCY,
                    error: 'Le nom existe déjà',
                    }, HttpStatus.FAILED_DEPENDENCY);
            }
            throw e;
        }
        return v;
    }

    @Get()
    findAll(): Promise<People[]>  {
    return this.peopleService.findAll();
    }

    @Get('/roots')
    findAllPeopleWithPhotos(): Promise<People[]>  {
        return this.peopleService.findAllPeopleWithPhotos();
    }

    @Get(':id')
    findPeople(@Param('id') id: string): Promise<People> {
        return this.peopleService.findOne(id);
    }

    @Post(':id/facetag')
    async createFaceTag(@Body() peopleFaceDto: PeopleFaceDto, @Param('id') id: string): Promise<any>{
        let v;
        try {
            v = await this.peopleService.createFaceTag(id,peopleFaceDto);
        } catch(e) { //TODO: gérer les autres erreurs ! 
            console.log(e);
            throw e;
        }
        return v;
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
