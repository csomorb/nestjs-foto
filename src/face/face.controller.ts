import { Controller, Post, Body, Get, Param, Put, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { FaceDto } from './face.dto';
import { FaceService } from './face.service';
import { Face } from './face.entity';

@Controller('faces')
export class FaceController {

    constructor(private faceService: FaceService) {}

    @Post()
    async createFaceTag(@Body() facveDto: FaceDto): Promise<any>{
        let v;
        try {
            v = await this.faceService.createface(facveDto);
        } catch(e) { //TODO: gérer les autres erreurs ! 
            console.log(e);
            throw e;
        }
        return v;
    }

    @Put(':idFace/people/:idPeople')
    update(@Param('idPeople') idPeople, @Param('idFace') idFace): Promise<Face> {
     return this.faceService.updateface(idFace, idPeople);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.faceService.deleteface(id);
    }

}
