import { Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleDto } from './people.dto';
import { Foto } from 'src/foto/foto.entity';
import { FotoService } from 'src/foto/foto.service';

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        private fotoService: FotoService
      ) {}
    
      findAll(): Promise<People[]> {
        return this.peopleRepository.find();
      }
    
      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["profilFoto"] });
      }
    
      findPeopleWithFotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id, { relations: ["fotos"] });
      }
    
      async remove(id: string): Promise<void> {
        await this.peopleRepository.delete(id);
      }
    
      async update(id: string, peopleDto: PeopleDto): Promise<People> {
        let people: People = await this.peopleRepository.findOne(id);
        return await this.peopleRepository.save({...people, ...peopleDto});
      }
    
      async create(peopleDto: PeopleDto): Promise<People> {
        const people = new People();
        people.name = peopleDto.name;
        people.description = peopleDto.description;
        if (peopleDto.birthDay){
            people.birthDay = new Date(peopleDto.birthDay);
        }
        if(peopleDto.idProfilFoto){
            const profilFoto: Foto = await this.fotoService.findOne(''+peopleDto.idProfilFoto);
            people.profilFoto = profilFoto;
        }
        return this.peopleRepository.save(people);
      }
}
