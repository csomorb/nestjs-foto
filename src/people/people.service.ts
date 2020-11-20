import { Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleDto, PeopleFaceDto } from './people.dto';
import { Photo } from 'src/photo/photo.entity';
import { PhotoService } from 'src/photo/photo.service';
import { FacesTaged } from './facesTaged.entity';
import * as Sharp from 'sharp';
import path = require('path');
import { FaceService } from 'src/face/face.service';


@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @InjectRepository(FacesTaged)
        private facesTagedRepository: Repository<FacesTaged>,
        private photoService: PhotoService,
        private faceServcie: FaceService
      ) {}
    
      findAll(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["coverPhoto"]});
      }
    
      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["coverPhoto"] });
      }

      findAllPeopleWithPhotos(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["facesTaged","coverPhoto"]});
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people.peopleToPhoto', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .getMany();
        return this.peopleRepository.find({ relations: ["coverPhoto"] });
      }
    
      findPeopleWithPhotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["facesTaged","coverPhoto"] });
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people_to_photo', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .where("people.id = :id", { id: id })
        .getOne();
        // return this.peopleRepository.findOne(id, { relations: ["peopleToPhoto","coverPhoto"] });
      }
    
      async remove(id: string): Promise<void> {
        //TODO: les photos tagés
        await this.peopleRepository.delete(id);
      }
    
      async update(id: string, peopleDto: PeopleDto): Promise<People> {
        const people: People = await this.peopleRepository.findOne(id);
        return await this.peopleRepository.save({...people, ...peopleDto});
      }

      async createFaceTag(id: string,peopleFaceDto: PeopleFaceDto){
        const people = await this.peopleRepository.findOne(id);
        const photo: Photo = await this.photoService.findOne(''+peopleFaceDto.idPhoto);
        photo.facesToTag.splice(photo.facesToTag.findIndex(f => f.x === peopleFaceDto.x && f.y === peopleFaceDto.y),1);
        let faceTag = new FacesTaged();
        faceTag.people = people;
        faceTag.photo = photo;
        faceTag.h = peopleFaceDto.h;
        faceTag.w = peopleFaceDto.w;
        faceTag.x = peopleFaceDto.x;
        faceTag.y = peopleFaceDto.y;
        faceTag.idPeople = people.id;
        faceTag.idPhoto = photo.idPhoto;
        await this.photoService.save(photo);
        const upFolder = path.join(__dirname, '..', '..', 'files'); 
        faceTag = await this.facesTagedRepository.save(faceTag);
        const image = Sharp(path.join(upFolder,photo.srcOrig));
        await image.extract({ left: (peopleFaceDto.x*photo.width), top: (peopleFaceDto.y*photo.height), width: (peopleFaceDto.w*photo.width), height: (peopleFaceDto.h*photo.height) })
        // .resize(200, 300, {
        //   fit: 'contain',
        // })
        .png()
        .toFile(path.join(upFolder,'facedescriptor','' + faceTag.facesTagedId + '.png'))
        .then(info => { console.log(info) })
        .catch(err => { console.log(err) });
        console.log("Image decoupé, construction du descripteur");
        const descriptor = await this.faceServcie.createDescriptor(people.id,faceTag.facesTagedId);
        faceTag.descriptor = descriptor;
        return await this.facesTagedRepository.save(faceTag);
      }

      async updateFaceTag(idFaceTaged: string,idPeople: string){
        const people = await this.peopleRepository.findOne(idPeople);
        const faceTag = await this.facesTagedRepository.findOne(idFaceTaged);
        faceTag.people = people;
        return this.facesTagedRepository.save(faceTag);
        // TODO: récupérer l'id extraire l'image et l'enregistrer
      }

      async deleteFaceTag(idFaceTaged: string){
        const faceTag = await this.facesTagedRepository.findOne(idFaceTaged);
        const faceToTag = {x:faceTag.x, y:faceTag.y, w:faceTag.w,h:faceTag.h};
        const photo = faceTag.photo;
        photo.facesToTag.push(faceToTag);
        await this.photoService.save(photo);
        return this.facesTagedRepository.delete(idFaceTaged);
        // TODO: récupérer l'id extraire l'image et l'enregistrer
      }
    
      async create(peopleDto: PeopleDto): Promise<People> {
        const people = new People();
        people.title = peopleDto.title;
        people.description = peopleDto.description;
        if (peopleDto.birthDay){
            people.birthDay = peopleDto.birthDay;
        }
        if(peopleDto.idCoverPhoto){
          people.coverPhoto = await this.photoService.findOne(''+peopleDto.idCoverPhoto);
        }
        return this.peopleRepository.save(people);
      }
}
