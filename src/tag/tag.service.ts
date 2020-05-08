import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { TagDto } from './tag.dto';
import { Foto } from 'src/foto/foto.entity';
import { FotoService } from 'src/foto/foto.service';


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
        private fotoService: FotoService
      ) {}
    
      findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
      }
    
      findOne(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["coverFoto"] });
      }
    
      findTagWithFotos(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["fotos"] });
      }
    
      async remove(id: string): Promise<void> {
        await this.tagRepository.delete(id);
      }
    
      async update(id: string, tagDto: TagDto): Promise<Tag> {
        let tag: Tag = await this.tagRepository.findOne(id);
        return await this.tagRepository.save({...tag, ...tagDto});
      }
    
      async create(tagDto: TagDto): Promise<Tag> {
        const tag = new Tag();
        tag.title = tagDto.title;
        tag.description = tagDto.description;
        if(tagDto.idCoverFoto){
            const coverFoto: Foto = await this.fotoService.findOne(''+tagDto.idCoverFoto);
            tag.coverFoto = coverFoto;
        }
        return this.tagRepository.save(tag);
      }
}
