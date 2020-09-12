import { Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleDto } from './people.dto';
import { Photo } from 'src/photo/photo.entity';
import { PhotoService } from 'src/photo/photo.service';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        private photoService: PhotoService
      ) {}
    
      findAll(): Promise<People[]> {
        return this.peopleRepository.find();
      }
    
      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["profilPhoto"] });
      }
    
      findPeopleWithPhotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id, { relations: ["photos"] });
      }
    
      async remove(id: string): Promise<void> {
        await this.peopleRepository.delete(id);
      }
    
      async update(id: string, peopleDto: PeopleDto): Promise<People> {
        const people: People = await this.peopleRepository.findOne(id);
        return await this.peopleRepository.save({...people, ...peopleDto});
      }
    
      async create(peopleDto: PeopleDto): Promise<People> {
        const people = new People();
        people.name = peopleDto.name;
        people.description = peopleDto.description;
        if (peopleDto.birthDay){
            people.birthDay = new Date(peopleDto.birthDay);
        }
        if(peopleDto.idProfilPhoto){
            const profilPhoto: Photo = await this.photoService.findOne(''+peopleDto.idProfilPhoto);
            people.profilPhoto = profilPhoto;
        }
        return this.peopleRepository.save(people);
      }
}