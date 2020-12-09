import { Controller, Post, Body, Get, Param, Put, Delete, HttpStatus, HttpException, Res } from '@nestjs/common';
import { PeopleService } from './people.service';
import { DownloadPeopleDto, PeopleDto } from './people.dto';
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

    @Get(':id/photos')
    findPeopleWithPhotos(@Param('id') id: string): Promise<People> {
        return this.peopleService.findPeopleWithPhotos(id);
    }

    @Get(':id/download')
    async download(@Param('id') id: string, @Res() res): Promise<any> {
        const zip = await this.peopleService.download(id);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }

    @Put(':id/download')
    async downloadItems(@Param('id') id: string, @Res() res, @Body() items: DownloadPeopleDto): Promise<any> {
        const zip = await this.peopleService.downloadItems(id,items);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }

    @Put(':id')
    update(@Body() peopleDto: PeopleDto, @Param('id') id): Promise<People> {
     return this.peopleService.update(id, peopleDto);
    }

    @Put(':idPeople/cover/:idPhoto')
    updateCover(@Param('idPeople') idPeople: string, @Param('idPhoto') idPhoto: string ): Promise<People> {
      return this.peopleService.setCover(idPeople,idPhoto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.peopleService.remove(id);
    }

}
