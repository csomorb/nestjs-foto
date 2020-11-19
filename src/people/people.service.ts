import { Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleDto, PeopleFaceDto } from './people.dto';
import { Photo } from 'src/photo/photo.entity';
import { PhotoService } from 'src/photo/photo.service';
import { PeopleToPhoto } from './peopleToPhoto.entity';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @InjectRepository(PeopleToPhoto)
        private peopleToPhotoRepository: Repository<PeopleToPhoto>,
        private photoService: PhotoService
      ) {}
    
      findAll(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["coverPhoto"]});
      }
    
      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["coverPhoto"] });
      }

      findAllPeopleWithPhotos(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["peopleToPhoto","coverPhoto"]});
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people.peopleToPhoto', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .getMany();
        return this.peopleRepository.find({ relations: ["coverPhoto"] });
      }
    
      findPeopleWithPhotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["peopleToPhoto","coverPhoto"] });
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
        const photo = await this.photoService.findOne(''+peopleFaceDto.idPhoto);
        const faceTag = new PeopleToPhoto();
        faceTag.people = people;
        faceTag.photo = photo;
        faceTag.h = peopleFaceDto.h;
        faceTag.w = peopleFaceDto.w;
        faceTag.x = peopleFaceDto.x;
        faceTag.y = peopleFaceDto.y;
        faceTag.idPeople = people.id;
        faceTag.idPhoto = photo.idPhoto;
        return this.peopleToPhotoRepository.save(faceTag);
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
