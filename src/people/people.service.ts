import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleDto } from './people.dto';
import { PhotoService } from 'src/photo/photo.service';


@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @Inject(forwardRef(() => PhotoService))
        private photoService: PhotoService,
      ) {}
    
      findAll(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["coverPhoto"]});
      }
    
      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["coverPhoto"] });
      }

      findAllPeopleWithPhotos(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["faces","coverPhoto"]});
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people.peopleToPhoto', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .getMany();
        return this.peopleRepository.find({ relations: ["coverPhoto"] });
      }
    
      findPeopleWithPhotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["faces.photo","faces","coverPhoto"] });
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
